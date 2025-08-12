
import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
    CardContent,
    IconButton,
    CircularProgress,
    Avatar,
    Divider,
    Paper,
    useTheme,
    Fade,
    Grow,
    useMediaQuery
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { Car, Edit2, Trash2 } from 'lucide-react';
import VehicleForm from '../components/VehicleForm';
import type { Vehicle } from '../types/Vehicles';
import { createVehicle, getVehicles, deleteVehicle } from '../services/allApis';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';

const Vehicles: React.FC = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await getVehicles();
                setVehicles(response.data);
            } catch (error) {
                console.error('Failed to fetch vehicles:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, []);

    const handleAddVehicle = async (vehicleData: Partial<Vehicle>) => {
        try {
            await createVehicle(vehicleData);
            const response = await getVehicles();
            setVehicles(response.data);
            setShowForm(false);
        } catch (error) {
            console.error('Failed to add vehicle:', error);
        }
    };

    const handleEditVehicle = (vehicle: Vehicle) => {
        setEditingVehicle(vehicle);
        setShowForm(true);
    };

    const handleUpdateVehicle = async (vehicleData: Partial<Vehicle>) => {
        if (!editingVehicle) return;

        try {
            const updatedVehicle = { ...editingVehicle, ...vehicleData };
            setVehicles(prev =>
                prev.map(v => (v.id === editingVehicle.id ? updatedVehicle : v))
            );
            setShowForm(false);
            setEditingVehicle(null);
        } catch (error) {
            console.error('Failed to update vehicle:', error);
        }
    };

    const handleConfirmDelete = async () => {
        if (!vehicleToDelete) return;

        try {
            setDeleteLoading(true);
            await deleteVehicle(vehicleToDelete.id);
            setVehicles(prev => prev.filter(v => v.id !== vehicleToDelete.id));
        } catch (error) {
            console.error("Failed to delete vehicle:", error);
        } finally {
            setDeleteLoading(false);
            setDeleteDialogOpen(false);
            setVehicleToDelete(null);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                <CircularProgress color="primary" />
            </Box>
        );
    }

    if (showForm) {
        return (
            <Box p={isSmallScreen ? 2 : 4}>
                <Paper
                    elevation={3}
                    sx={{
                        borderRadius: 3,
                        background: theme.palette.background.paper,
                        p: isSmallScreen ? 2 : 4,
                        maxWidth: 600,
                        mx: 'auto'
                    }}
                >
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
                    </Typography>
                    <VehicleForm
                        onSubmit={editingVehicle ? handleUpdateVehicle : handleAddVehicle}
                        onCancel={() => {
                            setShowForm(false);
                            setEditingVehicle(null);
                        }}  
                        initialData={editingVehicle || undefined}
                    />
                </Paper>
            </Box>
        );
    }

    return (
        <Box p={isSmallScreen ? 2 : 3} sx={{ background: theme.palette.background.default }}>
            {/* Header */}
            <Fade in timeout={500}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Box>
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
                            My Vehicles
                        </Typography>
                        <Typography variant={isSmallScreen ? "body2" : "subtitle1"} color="text.secondary">
                            Manage your registered vehicles
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setShowForm(true)}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            px: 3,
                            py: 1
                        }}
                    >
                        Add Vehicle
                    </Button>
                </Box>
            </Fade>

            {vehicles.length > 0 ? (
                <Grid container spacing={isSmallScreen ? 2 : 3}>
                    {vehicles.map((vehicle, idx) => (
                        <Grow in timeout={(idx + 1) * 200} key={vehicle.id}>
                            <Grid size={{ xs: 12, md: 4, sm: 6 }}>
                                <Paper
                                    elevation={3}
                                    sx={{
                                        borderRadius: 3,
                                        background: theme.palette.background.paper,
                                        transition: 'transform 0.3s, box-shadow 0.3s',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: theme.shadows[6]
                                        }
                                    }}
                                >
                                    <CardContent>
                                        <Box display="flex" alignItems="center" mb={2}>
                                            <Avatar
                                                sx={{
                                                    bgcolor: `${theme.palette.primary.main}20`,
                                                    color: theme.palette.primary.main,
                                                    mr: 2,
                                                    width: 48,
                                                    height: 48
                                                }}
                                            >
                                                <Car size={24} />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle1" fontWeight="medium">
                                                    {vehicle.make} {vehicle.model}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {vehicle.year}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Divider sx={{ my: 2 }} />

                                        <Box display="flex" justifyContent="space-between" mb={2}>
                                            <Typography variant="body2" color="text.secondary">
                                                Registration
                                            </Typography>
                                            <Typography variant="body2" fontWeight="medium">
                                                {vehicle.regNumber}
                                            </Typography>
                                        </Box>

                                        <Box display="flex" justifyContent="flex-end" mt={2}>
                                            <IconButton
                                                onClick={() => handleEditVehicle(vehicle)}
                                                size="small"
                                                sx={{
                                                    color: theme.palette.text.secondary,
                                                    '&:hover': {
                                                        color: theme.palette.primary.main
                                                    }
                                                }}
                                            >
                                                <Edit2 size={18} />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => {
                                                    setVehicleToDelete(vehicle);
                                                    setDeleteDialogOpen(true);
                                                }}
                                                size="small"
                                                sx={{
                                                    color: theme.palette.text.secondary,
                                                    '&:hover': {
                                                        color: theme.palette.error.main
                                                    }
                                                }}
                                            >
                                                <Trash2 size={18} />
                                            </IconButton>
                                        </Box>
                                    </CardContent>
                                </Paper>
                            </Grid>
                        </Grow>
                    ))}
                </Grid>
            ) : (
                <Fade in timeout={500}>
                    <Paper
                        elevation={3}
                        sx={{
                            borderRadius: 3,
                            background: theme.palette.background.paper,
                            p: 4,
                            textAlign: 'center'
                        }}
                    >
                        <Avatar
                            sx={{
                                bgcolor: `${theme.palette.primary.main}20`,
                                color: theme.palette.primary.main,
                                width: 64,
                                height: 64,
                                mx: 'auto',
                                mb: 2
                            }}
                        >
                            <Car size={32} />
                        </Avatar>
                        <Typography variant="h6" gutterBottom>
                            No vehicles added
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={3}>
                            Get started by adding your first vehicle
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => setShowForm(true)}
                            sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                px: 4,
                                py: 1.5
                            }}
                        >
                            Add Your First Vehicle
                        </Button>
                    </Paper>
                </Fade>
            )
            }

            {/* Confirm Delete Dialog */}
            <ConfirmDeleteDialog
                open={deleteDialogOpen}
                onClose={() => {
                    setDeleteDialogOpen(false);
                    setVehicleToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                loading={deleteLoading}
                title="Delete Vehicle"
                message={`Are you sure you want to delete ${vehicleToDelete?.make} ${vehicleToDelete?.model}?`}
            />
        </Box >
    );
};

export default Vehicles;