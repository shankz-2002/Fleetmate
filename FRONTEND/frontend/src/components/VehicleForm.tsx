import React, { useState } from 'react';
import {
    TextField,
    Button,
    Grid,
    Card,
    CardContent,
    CardActions,
    Typography
} from '@mui/material';
import type { Vehicle } from '../types/Vehicles';

interface VehicleFormProps {
    onSubmit: (vehicle: Partial<Vehicle>) => void;
    onCancel: () => void;
    initialData?: Partial<Vehicle>;
}

const VehicleForm: React.FC<VehicleFormProps> = ({
    onSubmit,
    onCancel,
    initialData = {},
}) => {
    const [formData, setFormData] = useState({
        make: initialData.make || '',
        model: initialData.model || '',
        year: initialData.year || new Date().getFullYear(),
        regNumber: initialData.regNumber || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (field: keyof typeof formData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid size={{}}>
                            <TextField
                                fullWidth
                                label="Make"
                                value={formData.make}
                                onChange={(e) => handleChange('make', e.target.value)}
                                placeholder="e.g., Toyota, Honda"
                                required
                            />
                        </Grid>
                        <Grid size={{}}>
                            <TextField
                                fullWidth
                                label="Model"
                                value={formData.model}
                                onChange={(e) => handleChange('model', e.target.value)}
                                placeholder="e.g., Camry, Civic"
                                required
                            />
                        </Grid>
                        <Grid size={{}}>
                            <TextField
                                fullWidth
                                label="Year"
                                type="number"
                                value={formData.year}
                                onChange={(e) => handleChange('year', parseInt(e.target.value))}
                                inputProps={{
                                    min: 1900,
                                    max: new Date().getFullYear() + 1
                                }}
                                required
                            />
                        </Grid>
                        <Grid size={{}}>
                            <TextField
                                fullWidth
                                label="Registration Number"
                                value={formData.regNumber}
                                onChange={(e) => handleChange('regNumber', e.target.value)}
                                placeholder="e.g., ABC-123"
                                required
                            />
                        </Grid>
                    </Grid>

                    <CardActions sx={{ justifyContent: 'flex-end', mt: 2 }}>
                        <Button onClick={onCancel} color="inherit" variant="outlined">
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" color="primary">
                            {initialData.id ? 'Update Vehicle' : 'Add Vehicle'}
                        </Button>
                    </CardActions>
                </form>
            </CardContent>
        </Card>
    );
};

export default VehicleForm;
