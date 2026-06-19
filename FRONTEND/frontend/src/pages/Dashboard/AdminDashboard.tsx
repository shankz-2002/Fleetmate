
import { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Typography,
    Card,
    Avatar,
    useTheme,
    Paper,
    Divider
} from '@mui/material';
import { Users, CalendarCheck, Wrench } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getUsersAdmin } from '../../services/allApis';

function StatCard({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
    return (
        <Card
            sx={{
                display: 'flex',
                alignItems: 'center',
                p: 3,
                height: '100%',
                boxShadow: 2,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                }
            }}
        >
            <Avatar
                sx={{
                    bgcolor: 'primary.main',
                    mr: 3,
                    width: 56,
                    height: 56,
                    color: 'common.white'
                }}
            >
                {icon}
            </Avatar>
            <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="h4" color="text.primary" fontWeight="bold">
                    {value}
                </Typography>
            </Box>
        </Card>
    );
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

function AdminDashboard() {
    const theme = useTheme();
    const [counts, setCounts] = useState({
        customers: 0,
        managers: 0,
        mechanics: 0,
    });

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const res = await getUsersAdmin();
                const data = res.data;
                setCounts({
                    customers: data.customer?.length || 0,
                    managers: data.manager?.length || 0,
                    mechanics: data.mechanic?.length || 0,
                });
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            }
        };
        fetchCounts();
    }, []);

    const pieData = [
        { name: 'Customers', value: counts.customers },
        { name: 'Managers', value: counts.managers },
        { name: 'Mechanics', value: counts.mechanics },
    ];

    return (
        <Box sx={{
            p: 4,
            backgroundColor: theme.palette.background.default,
            minHeight: '100vh'
        }}>
            <Typography
                variant="h4"
                gutterBottom
                sx={{
                    mb: 4,
                    fontWeight: 700,
                    color: theme.palette.text.primary
                }}
            >
                Admin Dashboard
            </Typography>

            {/* Stats Section */}
            <Grid container spacing={3} mb={4}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <StatCard
                        title="Total Customers"
                        value={counts.customers}
                        icon={<Users size={24} />}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <StatCard
                        title="Total Managers"
                        value={counts.managers}
                        icon={<CalendarCheck size={24} />}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <StatCard
                        title="Total Mechanics"
                        value={counts.mechanics}
                        icon={<Wrench size={24} />}
                    />
                </Grid>
            </Grid>

            {/* Charts Section */}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 7 }}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            height: '100%',
                            borderRadius: 2,
                            backgroundColor: theme.palette.background.paper
                        }}
                    >
                        <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                                fontWeight: 600,
                                mb: 3
                            }}
                        >
                            Users Distribution
                        </Typography>
                        <Box sx={{ height: 350 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={120}
                                        innerRadius={60}
                                        paddingAngle={5}
                                        label={({ name, percent }) =>
                                            `${name}: ${(percent !== undefined && percent !== null ? percent * 100 : 0).toFixed(0)}%`
                                        }
                                    >
                                        {pieData.map((__, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: number) => [`${value} users`, 'Count']}
                                    />
                                    <Legend
                                        layout="horizontal"
                                        verticalAlign="bottom"
                                        align="center"
                                        wrapperStyle={{ paddingTop: 20 }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 5 }}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            height: '100%',
                            borderRadius: 2,
                            backgroundColor: theme.palette.background.paper
                        }}
                    >
                        <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                                fontWeight: 600,
                                mb: 3
                            }}
                        >
                            Recent Activity
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box>
                            {[
                                'System maintenance scheduled for Friday',
                                'New manager account created',
                                'Updated service pricing guidelines',
                                '5 new customer registrations today'
                            ].map((activity, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mb: 2,
                                        p: 1,
                                        borderRadius: 1,
                                        '&:hover': {
                                            backgroundColor: theme.palette.action.hover
                                        }
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            bgcolor: COLORS[index % COLORS.length],
                                            mr: 2
                                        }}
                                    />
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                    >
                                        {activity}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box >
    );
}

export default AdminDashboard;