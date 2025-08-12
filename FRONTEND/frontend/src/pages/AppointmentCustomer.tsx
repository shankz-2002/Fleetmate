// 





import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Button,
    Stack,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    CircularProgress,
    Grid,
    Paper,
    useMediaQuery,
    useTheme
} from "@mui/material";
import { Add, FilterList, Close } from "@mui/icons-material";

import { useAuth } from "../context/AuthContext";
import { getAppointments } from "../services/allApis";
import AppointmentForm from "../components/Appointmentform";
import { AppointmentCard } from "../components/AppointmentCard";

interface Appointment {
    id: number;
    appointmentDate: string;
    status: string;
    vehicle: {
        id: number;
        make: string;
        model: string;
    };
}

const statusOptions = ["all", "pending", "in-progress", "completed", "cancelled"];

const AppointmentsPageCustomer: React.FC = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [openForm, setOpenForm] = useState(false);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await getAppointments();
                setAppointments(res.data.result || []);
                console.log("Appointments fetched:", res.data.result);
            } catch (err) {
                console.error("Failed to fetch appointments:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const filtered = appointments.filter((a) => {
        const normalizedStatus = a.status.toLowerCase().replace(" ", "-");
        return filter === "all" ? true : normalizedStatus === filter;
    });

    return (
        <Box p={{ xs: 2, md: 3 }}>
            {/* Header */}
            <Stack
                direction={isSmallScreen ? "column" : "row"}
                justifyContent="space-between"
                alignItems={isSmallScreen ? "flex-start" : "center"}
                mb={2}
                spacing={2}
            >
                <Box>
                    <Typography variant="h5" fontWeight="bold">
                        Appointments
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage service appointments and schedules
                    </Typography>
                </Box>
                {(user?.role === "customer" || user?.role === "admin") && (
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setOpenForm(true)}
                        fullWidth={isSmallScreen}
                    >
                        Book Appointment
                    </Button>
                )}
            </Stack>

            {/* Filters */}
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
                    <FilterList />
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                        {statusOptions.map((status) => (
                            <Chip
                                key={status}
                                label={status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
                                variant={filter === status ? "filled" : "outlined"}
                                color={filter === status ? "primary" : "default"}
                                onClick={() => setFilter(status)}
                                sx={{ mb: 1 }}
                            />
                        ))}
                    </Stack>
                </Stack>
            </Paper>

            {/* Appointment List or Loader */}
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={2}>
                    {filtered.length > 0 ? (
                        filtered.map((appointment) => (
                            <Grid size={{ xs: 12, sm: 6 }} key={appointment.id}>
                                <AppointmentCard
                                    appointment={appointment}
                                    showActions={user?.role === "mechanic"}
                                />
                            </Grid>
                        ))
                    ) : (
                        <Grid size={{ xs: 12 }}>
                            <Box textAlign="center" py={6}>
                                <Typography variant="h6" color="text.secondary">
                                    No {filter === "all" ? "" : `${filter} `}appointments found.
                                </Typography>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            )}

            {/* Appointment Form Dialog */}
            <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
                <DialogTitle
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    Book Appointment
                    <IconButton onClick={() => setOpenForm(false)}>
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <AppointmentForm
                        onSuccess={(newAppointment) => {
                            setAppointments((prev) => [newAppointment, ...prev]);
                            setOpenForm(false);
                        }}
                        onCancel={() => setOpenForm(false)}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default AppointmentsPageCustomer;
