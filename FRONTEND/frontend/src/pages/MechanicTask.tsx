// import { useEffect, useState } from 'react';
// import {
//     Box,
//     Typography,
//     Paper,
//     Button,
//     Stack,
//     CircularProgress,
//     useTheme,
//     useMediaQuery
// } from '@mui/material';
// import { CheckCircle, DirectionsCar, Notes } from '@mui/icons-material';
// import { getMechanicTasks, updateAppointmentStatus } from '../services/allApis';
// import type { Appointment } from '../types/Appointment';

// function MechanicTask() {
//     const theme = useTheme();
//     const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//     const [appointments, setAppointments] = useState<Appointment[]>([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchTasks = async () => {
//             try {
//                 const res = await getMechanicTasks();
//                 setAppointments(res.data.appoint || []);
//             } catch (err) {
//                 console.error('Failed to load tasks:', err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchTasks();
//     }, []);

//     const handleComplete = async (id: number) => {
//         try {
//             await updateAppointmentStatus(id, "completed");
//             setAppointments(prev =>
//                 prev.map(app => app.id === id ? { ...app, status: 'completed' } : app)
//             );
//         } catch (err) {
//             console.error("Failed to update status:", err);
//             alert("Failed to finish task.");
//         }
//     };

//     return (
//         <Box sx={{ p: isMobile ? 2 : 4 }}>
//             <Typography variant="h4" fontWeight={700} mb={3}>
//                 My Assigned Tasks
//             </Typography>

//             {loading ? (
//                 <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
//                     <CircularProgress />
//                 </Box>
//             ) : appointments.length === 0 ? (
//                 <Typography variant="body1" color="text.secondary">
//                     No tasks assigned currently.
//                 </Typography>
//             ) : (
//                 <Stack spacing={3}>
//                     {appointments.map((appointment) => (
//                         <Paper key={appointment.id} elevation={2} sx={{ p: 3, borderRadius: 3 }}>
//                             <Stack spacing={1}>
//                                 <Typography variant="h6" fontWeight={600}>
//                                     Appointment {appointment.id}
//                                 </Typography>

//                                 <Stack direction="row" spacing={1} alignItems="center">
//                                     <DirectionsCar fontSize="small" color="action" />
//                                     <Typography>
//                                         {appointment.vehicle?.make} {appointment.vehicle?.model} ({appointment.vehicle?.year})
//                                     </Typography>
//                                 </Stack>

//                                 {appointment.remarks && (
//                                     <Stack direction="row" spacing={1} alignItems="center">
//                                         <Notes fontSize="small" color="action" />
//                                         <Typography color="text.secondary">
//                                             {appointment.remarks}
//                                         </Typography>
//                                     </Stack>
//                                 )}

//                                 <Typography variant="body2" color="text.secondary">
//                                     Status: <strong>{appointment.status}</strong>
//                                 </Typography>

//                                 {appointment.status.toLowerCase() !== "completed" && (
//                                     <Button
//                                         variant="contained"
//                                         color="success"
//                                         startIcon={<CheckCircle />}
//                                         onClick={() => handleComplete(appointment.id)}
//                                         sx={{ mt: 2, alignSelf: 'start' }}
//                                     >
//                                         Finish Task
//                                     </Button>
//                                 )}
//                             </Stack>
//                         </Paper>
//                     ))}
//                 </Stack>
//             )}
//         </Box>
//     );
// }

// export default MechanicTask;






import { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    Stack,
    CircularProgress,
    useTheme,
    useMediaQuery,
    Chip,
    Divider,
    Avatar,
    Badge
} from '@mui/material';
import { CheckCircle, DirectionsCar, Notes, Assignment, DoneAll } from '@mui/icons-material';
import { getMechanicTasks, updateAppointmentStatus } from '../services/allApis';
import type { Appointment } from '../types/Appointment';

function MechanicTask() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await getMechanicTasks();
                setAppointments(res.data.appoint || []);
            } catch (err) {
                console.error('Failed to load tasks:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const handleComplete = async (id: number) => {
        try {
            await updateAppointmentStatus(id, "completed");
            setAppointments(prev =>
                prev.map(app => app.id === id ? { ...app, status: 'completed' } : app)
            );
        } catch (err) {
            console.error("Failed to update status:", err);
            alert("Failed to finish task.");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'success';
            case 'in-progress':
                return 'primary';
            case 'pending':
                return 'warning';
            default:
                return 'default';
        }
    };

    return (
        <Box sx={{
            p: isMobile ? 2 : 4,
            maxWidth: 1200,
            margin: '0 auto'
        }}>
            <Stack direction="row" alignItems="center" spacing={2} mb={4}>
                <Avatar sx={{
                    bgcolor: theme.palette.primary.main,
                    width: 56,
                    height: 56
                }}>
                    <Assignment sx={{ fontSize: 32 }} />
                </Avatar>
                <div>
                    <Typography variant="h4" fontWeight={700}>
                        My Assigned Tasks
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        {appointments.length} {appointments.length === 1 ? 'task' : 'tasks'} assigned
                    </Typography>
                </div>
            </Stack>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                    <CircularProgress size={60} thickness={4} />
                </Box>
            ) : appointments.length === 0 ? (
                <Paper elevation={0} sx={{
                    p: 4,
                    textAlign: 'center',
                    bgcolor: theme.palette.grey[50],
                    borderRadius: 3
                }}>
                    <DoneAll sx={{
                        fontSize: 60,
                        color: theme.palette.success.main,
                        mb: 2
                    }} />
                    <Typography variant="h6" gutterBottom>
                        No tasks assigned currently
                    </Typography>
                    <Typography color="text.secondary">
                        You're all caught up! New tasks will appear here when assigned.
                    </Typography>
                </Paper>
            ) : (
                <Stack spacing={3}>
                    {appointments.map((appointment) => (
                        <Paper
                            key={appointment.id}
                            elevation={3}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                borderLeft: `4px solid ${theme.palette.primary.main}`,
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: theme.shadows[6]
                                }
                            }}
                        >
                            <Stack spacing={2}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Badge
                                        // badgeContent={`${appointment.id}`}
                                        color="primary"
                                        sx={{
                                            '& .MuiBadge-badge': {
                                                right: -10,
                                                top: 10,
                                                fontSize: 12,
                                                fontWeight: 'bold'
                                            }
                                        }}
                                    >
                                        <Typography variant="h6" fontWeight={600}>
                                            Vehicle Service
                                        </Typography>
                                    </Badge>
                                    <Chip
                                        label={appointment.status}
                                        color={getStatusColor(appointment.status)}
                                        size={isMobile ? 'small' : 'medium'}
                                        sx={{
                                            fontWeight: 600,
                                            textTransform: 'capitalize'
                                        }}
                                    />
                                </Stack>

                                <Divider />

                                <Stack spacing={1.5}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <DirectionsCar fontSize="medium" sx={{ color: theme.palette.grey[600] }} />
                                        <div>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Vehicle
                                            </Typography>
                                            <Typography fontWeight={500}>
                                                {appointment.vehicle?.make} {appointment.vehicle?.model} ({appointment.vehicle?.year})
                                            </Typography>
                                        </div>
                                    </Stack>

                                    {appointment.remarks && (
                                        <Stack direction="row" spacing={2} alignItems="flex-start">
                                            <Notes fontSize="medium" sx={{ color: theme.palette.grey[600], mt: 0.5 }} />
                                            <div>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    Service Notes
                                                </Typography>
                                                <Typography>
                                                    {appointment.remarks}
                                                </Typography>
                                            </div>
                                        </Stack>
                                    )}
                                </Stack>

                                {appointment.status.toLowerCase() !== "completed" && (
                                    <Button
                                        variant="contained"
                                        color="success"
                                        startIcon={<CheckCircle />}
                                        onClick={() => handleComplete(appointment.id)}
                                        sx={{
                                            mt: 2,
                                            alignSelf: 'flex-start',
                                            px: 3,
                                            py: 1.5,
                                            fontWeight: 600,
                                            borderRadius: 2
                                        }}
                                        size={isMobile ? 'medium' : 'large'}
                                    >
                                        Mark as Completed
                                    </Button>
                                )}
                            </Stack>
                        </Paper>
                    ))}
                </Stack>
            )}
        </Box>
    );
}

export default MechanicTask;