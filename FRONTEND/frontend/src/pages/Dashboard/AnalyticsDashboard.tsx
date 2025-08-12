import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    CircularProgress,
    Paper,
    Grid,
    useTheme,
} from "@mui/material";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from "recharts";
import { analysis } from "../../services/allApis";

type UserCount = { role: string; count: number };
type VehiclesByMonth = { month: string; count: number };
type AppointmentStatus = { status: string; count: number };
type RevenueByMonth = { month: string; totalRevenue: number };

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EFF"];

const AnalyticsDashboard: React.FC = () => {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [userCounts, setUserCounts] = useState<UserCount[]>([]);
    const [vehiclesByMonth, setVehiclesByMonth] = useState<VehiclesByMonth[]>([]);
    const [appointmentsByStatus, setAppointmentsByStatus] = useState<
        AppointmentStatus[]
    >([]);
    const [revenueByMonth, setRevenueByMonth] = useState<RevenueByMonth[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const { data } = await analysis() // Adjust URL as needed
                setUserCounts(data.userCounts);
                setVehiclesByMonth(data.vehiclesByMonth);
                setAppointmentsByStatus(data.appointmentsByStatus);
                setRevenueByMonth(data.revenueByMonth);
            } catch (err) {
                console.error(err);
                setError("Failed to load analytics.");
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading)
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="60vh"
            >
                <CircularProgress color="primary" />
            </Box>
        );

    if (error)
        return (
            <Box textAlign="center" mt={4}>
                <Typography color="error">{error}</Typography>
            </Box>
        );

    return (
        <Box p={3} sx={{ background: theme.palette.background.default }}>
            <Typography
                variant="h4"
                fontWeight="bold"
                mb={4}
                sx={{
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                }}
            >
                System Analytics Dashboard
            </Typography>

            <Grid container spacing={4}>
                {/* User Counts Pie Chart */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6" mb={2}>
                            Users by Role
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={userCounts}
                                    dataKey="count"
                                    nameKey="role"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill={theme.palette.primary.main}
                                    label
                                >
                                    {userCounts.map((__, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Vehicles Added Bar Chart */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6" mb={2}>
                            Vehicles Added (Last 6 Months)
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={vehiclesByMonth}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill={theme.palette.primary.main} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Appointments Status Pie Chart */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6" mb={2}>
                            Appointments by Status
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={appointmentsByStatus}
                                    dataKey="count"
                                    nameKey="status"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill={theme.palette.primary.main}
                                    label
                                >
                                    {appointmentsByStatus.map((__, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Revenue by Month Bar Chart */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6" mb={2}>
                            Revenue (Last 6 Months)
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={revenueByMonth}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="totalRevenue" fill={theme.palette.primary.main} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AnalyticsDashboard;
