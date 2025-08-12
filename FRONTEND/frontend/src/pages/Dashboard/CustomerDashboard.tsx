
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
    useMediaQuery,
} from '@mui/material';
import {
    Car,
    Calendar,
    CheckCircle,
    Clock,
} from 'lucide-react';
import { AppointmentCard } from '../../components/AppointmentCard';
import { getAppointments, getVehicles, createVehicle } from '../../services/allApis';
import type { Vehicle } from '../../types/Vehicles';
import VehicleForm from '../../components/VehicleForm';

export const CustomerDashboard: React.FC = () => {
    const theme = useTheme();
    const [appointments, setAppointments] = useState<any[]>([]);
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showVehicleForm, setShowVehicleForm] = useState(false);
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [appointmentsData, vehiclesData] = await Promise.all([
                    getAppointments(),
                    getVehicles()
                ]);
                setAppointments(appointmentsData.data.result);
                setVehicles(vehiclesData.data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAddVehicle = async (vehicleData: Partial<Vehicle>) => {
        try {
            const res = await createVehicle(vehicleData);
            setVehicles(prev => [...prev, res.data?.result || res.data]);
            setShowVehicleForm(false);
        } catch (error) {
            console.error("Failed to add vehicle:", error);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress />
            </Box>
        );
    }

    if (showVehicleForm) {
        return (
            <Box p={2}>
                <Paper elevation={3} sx={{ borderRadius: 3, p: 2, maxWidth: 600, mx: 'auto' }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Add New Vehicle
                    </Typography>
                    <VehicleForm
                        onSubmit={handleAddVehicle}
                        onCancel={() => setShowVehicleForm(false)}
                    />
                </Paper>
            </Box>
        );
    }

    const completedAppointments = appointments.filter(a => a.status === 'completed');
    const upcomingAppointments = appointments.filter(a => a.status !== 'completed' && a.status !== 'cancelled');

    const stats = [
        {
            name: 'My Vehicles',
            value: vehicles.length,
            icon: <Car size={24} />,
            color: theme.palette.primary.main
        },
        {
            name: 'Upcoming Services',
            value: upcomingAppointments.length,
            icon: <Calendar size={24} />,
            color: theme.palette.warning.main
        },
        {
            name: 'Completed Services',
            value: completedAppointments.length,
            icon: <CheckCircle size={24} />,
            color: theme.palette.success.main
        },
        {
            name: 'Pending Approval',
            value: appointments.filter(a => a.status === 'pending').length,
            icon: <Clock size={24} />,
            color: theme.palette.info.main
        }
    ];

    return (
        <Box p={2} sx={{ background: theme.palette.background.default }}>
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
                        Customer Dashboard
                    </Typography>
                    <Typography variant={isSmallScreen ? "body2" : "subtitle1"} color="text.secondary">
                        Manage your vehicles and service appointments
                    </Typography>
                </Box>
            </Fade>

            {/* Stats */}
            <Grid container spacing={2} mb={4}>
                {stats.map((stat, idx) => (
                    <Grow in timeout={(idx + 1) * 300} key={stat.name}>
                        <Grid size={{ xs: 6, sm: 6, md: 3 }}>
                            <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
                                <Stack alignItems="center" spacing={1}>
                                    <Avatar sx={{ bgcolor: `${stat.color}20`, color: stat.color }}>{stat.icon}</Avatar>
                                    <Typography variant="subtitle2" color="text.secondary" align="center">
                                        {stat.name}
                                    </Typography>
                                    <Typography variant="h5" fontWeight="bold" align="center">
                                        {stat.value}
                                    </Typography>
                                </Stack>
                            </Paper>
                        </Grid>
                    </Grow>
                ))}
            </Grid>

            {/* Appointments & Vehicles */}
            <Grid container spacing={2} mb={4}>
                <Grid size={{ xs: 12, md: 6 }} >
                    <Grow in timeout={800}>
                        <Paper elevation={3} sx={{ borderRadius: 3 }}>
                            <CardContent>
                                <Typography variant="h6" fontWeight="bold" mb={1}>
                                    Upcoming Appointments
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                <Stack spacing={2}>
                                    {upcomingAppointments.slice(0, 3).map((appointment) => (
                                        <AppointmentCard key={appointment.id} appointment={appointment} />
                                    ))}
                                    {upcomingAppointments.length === 0 && (
                                        <Typography color="text.secondary" align="center">No upcoming appointments</Typography>
                                    )}
                                </Stack>
                            </CardContent>
                        </Paper>
                    </Grow>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }} >
                    <Grow in timeout={1000}>
                        <Paper elevation={3} sx={{ borderRadius: 3 }}>
                            <CardContent>
                                <Typography variant="h6" fontWeight="bold" mb={1}>
                                    My Vehicles
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                <Stack spacing={2}>
                                    {vehicles.slice(0, 3).map((vehicle) => (
                                        <Box key={vehicle.id}>
                                            <Typography variant="subtitle1" fontWeight="medium">
                                                {vehicle.make} {vehicle.model}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {vehicle.year} • {vehicle.regNumber}
                                            </Typography>
                                        </Box>
                                    ))}
                                    {vehicles.length === 0 && (
                                        <Typography color="text.secondary" align="center">No vehicles registered</Typography>
                                    )}
                                </Stack>
                            </CardContent>
                        </Paper>
                    </Grow>
                </Grid>
            </Grid>

            {/* Recent Services */}
            <Grow in timeout={1200}>
                <Paper elevation={3} sx={{ borderRadius: 3, p: 2 }}>
                    <Typography variant="h6" fontWeight="bold" mb={2}>
                        Recent Services
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                        {completedAppointments.slice(0, isSmallScreen ? 2 : isMediumScreen ? 3 : 4).map((appointment) => (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={appointment.id}>
                                <AppointmentCard appointment={appointment} />
                            </Grid>
                        ))}
                        {completedAppointments.length === 0 && (
                            <Grid size={{ xs: 12 }}>
                                <Typography color="text.secondary" align="center">No service history available</Typography>
                            </Grid>
                        )}
                    </Grid>
                </Paper>
            </Grow>
        </Box>
    );
};
