
import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Stack,
    Chip,
    CircularProgress,
    Paper,
    useTheme,
    Fade,
    Grow,
    useMediaQuery
} from "@mui/material";
import { Filter, Car, CheckCircle, Clock, X } from 'lucide-react';
import {
    getAppointmentsManager,
    findMechanic,
    assignMechanicToAppointment,
    cancelAppointment
} from "../services/allApis";
import { AppointmentCard } from "../components/AppointmentCard";
import type { Appointment } from "../types/Appointment";
import type { Mechanic } from "../types/Mechanic";

const statusOptions = ["all", "pending", "in-progress", "completed", "cancelled"];

const statusIcons = {
    "all": <Filter size={18} />,
    "pending": <Clock size={18} />,
    "in-progress": <Car size={18} />,
    "completed": <CheckCircle size={18} />,
    "cancelled": <X size={18} />
};

const AppointmentManager: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [mechanics, setMechanics] = useState<Mechanic[]>([]);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [appointmentsRes, mechanicsRes] = await Promise.all([
                    getAppointmentsManager(),
                    findMechanic()
                ]);

                const appts = appointmentsRes.data.result || [];
                const fetchedMechanics = mechanicsRes.data.result || [];

                const mechanicIds = new Set<number>();
                const allMechanics: Mechanic[] = [];

                fetchedMechanics.forEach((m: any) => {
                    mechanicIds.add(m.id);
                    allMechanics.push(m);
                });

                appts.forEach((app: any) => {
                    if (app.mechanic && !mechanicIds.has(app.mechanic.id)) {
                        mechanicIds.add(app.mechanic.id);
                        allMechanics.push(app.mechanic);
                    }
                });

                setAppointments(appts);
                setMechanics(allMechanics);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleStatusUpdate = async (appointmentId: number, newStatus: string) => {
        if (newStatus === "cancelled") {
            try {
                await cancelAppointment(appointmentId);
                setAppointments(prev =>
                    prev.map(app =>
                        app.id === appointmentId
                            ? { ...app, status: newStatus }
                            : app
                    )
                );
            } catch (error) {
                console.error("Failed to cancel appointment:", error);
                alert("Failed to cancel appointment");
            }
        } else {
            setAppointments(prev =>
                prev.map(app =>
                    app.id === appointmentId
                        ? { ...app, status: newStatus }
                        : app
                )
            );
        }
    };

    const handleAssignMechanic = async (appointmentId: number, mechanicId: number) => {
        try {
            await assignMechanicToAppointment(appointmentId, mechanicId);
            const mechanic = mechanics.find(m => m.id === mechanicId);

            setAppointments(prev =>
                prev.map(app =>
                    app.id === appointmentId
                        ? {
                            ...app,
                            mechanic: mechanic,
                            status: "in-progress"
                        }
                        : app
                )
            );
        } catch (err: any) {
            console.error("Mechanic assign failed:", err);
            const errorMsg = err?.data?.msg;

            if (errorMsg?.includes("Appointment has been cancelled")) {
                setAppointments(prev =>
                    prev.map(app =>
                        app.id === appointmentId
                            ? { ...app, status: "cancelled" }
                            : app
                    )
                );
            }

            alert(errorMsg || "Failed to assign mechanic.");
        }
    };

    const filtered = appointments.filter(a => {
        const normalizedStatus = a.status.toLowerCase().replace(" ", "-");
        return filter === "all" ? true : normalizedStatus === filter;
    });

    const getAvailableMechanics = (): Mechanic[] => {
        return mechanics.filter((m: any) => !m.isEngaged);
    };

    return (
        <Box sx={{ p: isMobile ? 2 : 3, background: theme.palette.background.default }}>
            {/* Gradient Header */}
            <Fade in timeout={500}>
                <Box mb={4}>
                    <Typography
                        variant={isMobile ? "h4" : "h3"}
                        fontWeight="bold"
                        sx={{
                            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 1
                        }}
                    >
                        Appointments Dashboard
                    </Typography>
                    <Typography variant={isMobile ? "body2" : "body1"} color="text.secondary">
                        Manage and assign mechanics to service appointments
                    </Typography>
                </Box>
            </Fade>

            {/* Filter Chips */}
            <Grow in timeout={800}>
                <Paper elevation={0} sx={{
                    mb: 4,
                    p: 3,
                    borderRadius: 3,
                    background: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`
                }}>
                    <Stack direction={isMobile ? "column" : "row"} alignItems="center" spacing={2}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
                            <Filter size={20} style={{ marginRight: 8 }} /> Filter by:
                        </Typography>
                        <Stack direction="row" flexWrap="wrap" gap={1}>
                            {statusOptions.map(status => (
                                <Chip
                                    key={status}
                                    icon={statusIcons[status as keyof typeof statusIcons]}
                                    label={status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
                                    variant={filter === status ? "filled" : "outlined"}
                                    color={filter === status ? "primary" : "default"}
                                    onClick={() => setFilter(status)}
                                    sx={{
                                        borderRadius: 2,
                                        px: 1,
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: theme.shadows[2]
                                        }
                                    }}
                                />
                            ))}
                        </Stack>
                    </Stack>
                </Paper>
            </Grow>

            {/* Appointments List */}
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
                    <CircularProgress color="primary" />
                </Box>
            ) : (
                <Stack spacing={2}>
                    {filtered.length > 0 ? (
                        filtered.map((appointment, index) => (
                            <Grow in timeout={(index + 1) * 200} key={appointment.id}>
                                <Box width="100%">
                                    <AppointmentCard
                                        appointment={appointment}
                                        showMechanicAssignSelect={true}
                                        mechanics={getAvailableMechanics()}
                                        onAssignMechanic={handleAssignMechanic}
                                        onStatusUpdate={handleStatusUpdate}
                                        sx={{
                                            width: '100%',
                                            borderRadius: 3,
                                            background: theme.palette.background.paper,
                                            transition: 'transform 0.3s, box-shadow 0.3s',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: theme.shadows[4]
                                            }
                                        }}
                                        showFullRemarks={true}  // Added prop to show full remarks
                                    />
                                </Box>
                            </Grow>
                        ))
                    ) : (
                        <Paper elevation={0} sx={{
                            p: 4,
                            textAlign: 'center',
                            borderRadius: 3,
                            background: theme.palette.background.paper,
                            border: `1px dashed ${theme.palette.divider}`
                        }}>
                            <Box sx={{
                                width: 80,
                                height: 80,
                                mx: 'auto',
                                mb: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: `${theme.palette.action.hover}30`,
                                borderRadius: '50%'
                            }}>
                                <X size={32} color={theme.palette.text.disabled} />
                            </Box>
                            <Typography variant="h6" color="text.secondary">
                                No {filter === "all" ? "" : `${filter} `}appointments found
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mt={1}>
                                {filter === "all" ?
                                    "No appointments in the system yet" :
                                    `Try changing your filter to see other appointments`}
                            </Typography>
                        </Paper>
                    )}
                </Stack>
            )}
        </Box>
    );
};

export default AppointmentManager;  