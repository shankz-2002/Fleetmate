
import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Typography,
    CardContent,
    CircularProgress,
    Divider,
    Stack,
    Avatar,
    useTheme,
    Fade,
    Grow,
    Paper,
    useMediaQuery
} from '@mui/material';
import {
    Users,
    Calendar,
    CheckCircle,
    Clock,
    Wrench,
    AlertCircle
} from 'lucide-react';
import { AppointmentCard } from '../../components/AppointmentCard';
import { findMechanic, getAppointmentsManager } from '../../services/allApis';

export const ManagerDashboard: React.FC = () => {
    const theme = useTheme();
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [mechanics, setMechanics] = useState<any[]>([]);
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [appointmentsData, mechanicData] = await Promise.all([
                    getAppointmentsManager(),
                    findMechanic()
                ]);
                setAppointments(appointmentsData.data.result);
                setMechanics(mechanicData.data.result);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress />
            </Box>
        );
    }

    const completedAppointments = appointments.filter(a => a.status === 'completed');
    const pendingAppointments = appointments.filter(a => a.status === 'pending');
    const inProgressAppointments = appointments.filter(
        (a) => a.status?.toLowerCase().replace(/\s+/g, '-') === 'in-progress'
    );

    const stats = [
        {
            name: 'Total Appointments',
            value: appointments.length,
            icon: <Calendar size={24} />,
            color: theme.palette.primary.main,
            trend: 'up'
        },
        {
            name: 'Available Mechanics',
            value: mechanics.length,
            icon: <Users size={24} />,
            color: theme.palette.success.main,
            trend: 'neutral'
        },
        {
            name: 'Completed Services',
            value: completedAppointments.length,
            icon: <CheckCircle size={24} />,
            color: theme.palette.info.main,
            trend: 'up'
        },
        {
            name: 'Pending Approval',
            value: pendingAppointments.length,
            icon: <Clock size={24} />,
            color: theme.palette.warning.main,
            trend: pendingAppointments.length > 0 ? 'up' : 'neutral'
        }
    ];

    return (
        <Box p={isSmallScreen ? 2 : 3} sx={{ background: theme.palette.background.default }}>
            {/* Header */}
            <Fade in timeout={500}>
                <Box mb={4}>
                    <Typography
                        variant={isSmallScreen ? "h4" : "h3"}
                        fontWeight="bold"
                        sx={{
                            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 1
                        }}
                    >
                        Manager Dashboard
                    </Typography>
                    <Typography variant={isSmallScreen ? "body2" : "subtitle1"} color="text.secondary">
                        Manage appointments, mechanics, and operations
                    </Typography>
                </Box>
            </Fade>

            {/* Stats Cards */}
            {/* Stats Cards */}
            <Grid container spacing={isSmallScreen ? 2 : 3} mb={4}>
                {stats.map((stat, idx) => (
                    <Grow in timeout={(idx + 1) * 300} key={stat.name}>
                        <Grid size={{xs:6,sm:6,md:3}}>     
                            <Paper
                                elevation={3}
                                sx={{
                                    borderRadius: 3,
                                    background: theme.palette.background.paper,
                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: theme.shadows[6]
                                    },
                                    // Maintain square shape
                                    position: 'relative',
                                    width: '100%',
                                    paddingTop: '100%', // This creates a 1:1 aspect ratio
                                    height: 0 // Required for padding-top trick to work
                                }}
                            >
                                <CardContent
                                    sx={{
                                        // Position content absolutely within the square
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        p: isSmallScreen ? 1 : 2
                                    }}
                                >
                                    <Avatar sx={{
                                        bgcolor: `${stat.color}20`,
                                        color: stat.color,
                                        width: isSmallScreen ? 40 : 56,
                                        height: isSmallScreen ? 40 : 56,
                                        mb: 1
                                    }}>
                                        {stat.icon}
                                    </Avatar>
                                    <Typography
                                        variant={isSmallScreen ? "caption" : "subtitle2"}
                                        color="text.secondary"
                                        align="center"
                                        sx={{ mb: 0.5 }}
                                    >
                                        {stat.name}
                                    </Typography>
                                    <Typography
                                        variant={isSmallScreen ? "h5" : "h4"}
                                        fontWeight="bold"
                                        align="center"
                                    >
                                        {stat.value}
                                    </Typography>
                                </CardContent>
                            </Paper>
                        </Grid>
                    </Grow>
                ))}
            </Grid>

            {/* Pending and In Progress Appointments */}
            <Grid container spacing={isSmallScreen ? 2 : 3} mb={4}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Grow in timeout={800}>
                        <Paper
                            elevation={3}
                            sx={{
                                borderRadius: 3,
                                background: theme.palette.background.paper,
                                height: '100%'
                            }}
                        >
                            <CardContent>
                                <Typography variant={isSmallScreen ? "h6" : "h5"} fontWeight="bold" mb={1}>
                                    Pending Appointments
                                </Typography>
                                <Typography variant={isSmallScreen ? "caption" : "body2"} color="text.secondary" mb={2}>
                                    Appointments awaiting mechanic assignment
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                {pendingAppointments.length > 0 ? (
                                    <Stack spacing={2}>
                                        {pendingAppointments.slice(0, 3).map((appointment) => (
                                            <AppointmentCard
                                                key={appointment.id}
                                                appointment={appointment}
                                                sx={{
                                                    transition: 'transform 0.3s',
                                                    '&:hover': {
                                                        transform: 'scale(1.02)'
                                                    }
                                                }}
                                            // compact={isSmallScreen}
                                            />
                                        ))}
                                    </Stack>
                                ) : (
                                    <Box
                                        textAlign="center"
                                        py={4}
                                        sx={{
                                            background: `${theme.palette.success.light}10`,
                                            borderRadius: 2
                                        }}
                                    >
                                        <CheckCircle
                                            size={isSmallScreen ? 40 : 48}
                                            color={theme.palette.success.main}
                                        />
                                        <Typography variant={isSmallScreen ? "body1" : "subtitle1"} mt={1} color="success.main">
                                            All caught up!
                                        </Typography>
                                        <Typography variant={isSmallScreen ? "caption" : "body2"} color="text.secondary">
                                            No pending appointments at the moment.
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Paper>
                    </Grow>
                </Grid>

                {/* In Progress Appointments */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Grow in timeout={1000}>
                        <Paper
                            elevation={3}
                            sx={{
                                borderRadius: 3,
                                background: theme.palette.background.paper,
                                height: '100%'
                            }}
                        >
                            <CardContent>
                                <Typography variant={isSmallScreen ? "h6" : "h5"} fontWeight="bold" mb={1}>
                                    In Progress
                                </Typography>
                                <Typography variant={isSmallScreen ? "caption" : "body2"} color="text.secondary" mb={2}>
                                    Currently ongoing services
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                {inProgressAppointments.length > 0 ? (
                                    <Stack spacing={2}>
                                        {inProgressAppointments.slice(0, 3).map((appointment) => (
                                            <AppointmentCard
                                                key={appointment.id}
                                                appointment={appointment}
                                                sx={{
                                                    transition: 'transform 0.3s',
                                                    '&:hover': {
                                                        transform: 'scale(1.02)'
                                                    }
                                                }}
                                            // compact={isSmallScreen}
                                            />
                                        ))}
                                    </Stack>
                                ) : (
                                    <Box
                                        textAlign="center"
                                        py={4}
                                        sx={{
                                            background: `${theme.palette.warning.light}10`,
                                            borderRadius: 2
                                        }}
                                    >
                                        <Wrench
                                            size={isSmallScreen ? 40 : 48}
                                            color={theme.palette.warning.main}
                                        />
                                        <Typography variant={isSmallScreen ? "body1" : "subtitle1"} mt={1} color="warning.main">
                                            No active services
                                        </Typography>
                                        <Typography variant={isSmallScreen ? "caption" : "body2"} color="text.secondary">
                                            All mechanics are currently available.
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Paper>
                    </Grow>
                </Grid>
            </Grid>

            {/* Recent Activity */}
            <Grow in timeout={1200}>
                <Paper
                    elevation={3}
                    sx={{
                        borderRadius: 3,
                        background: theme.palette.background.paper,
                        p: isSmallScreen ? 2 : 3
                    }}
                >
                    <Typography variant={isSmallScreen ? "h6" : "h5"} fontWeight="bold" mb={2}>
                        Recent Activity
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    {appointments.length > 0 ? (
                        <Grid container spacing={isSmallScreen ? 1 : 3}>
                            {appointments.slice(0, isSmallScreen ? 2 : isMediumScreen ? 3 : 4).map((appointment) => (
                                <Grid size={{ xs: 12, md: 3, sm: 6 }} key={appointment.id}>
                                    <AppointmentCard
                                        appointment={appointment}
                                        // variant="outlined"
                                    // compact={isSmallScreen}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Box
                            textAlign="center"
                            py={4}
                            sx={{
                                background: `${theme.palette.info.light}10`,
                                borderRadius: 2
                            }}
                        >
                            <AlertCircle
                                size={isSmallScreen ? 40 : 48}
                                color={theme.palette.info.main}
                            />
                            <Typography variant={isSmallScreen ? "body1" : "subtitle1"} mt={1} color="info.main">
                                No recent activity
                            </Typography>
                            <Typography variant={isSmallScreen ? "caption" : "body2"} color="text.secondary">
                                There are no appointments in the system yet.
                            </Typography>
                        </Box>
                    )}
                </Paper>
            </Grow>
        </Box>
    );
};