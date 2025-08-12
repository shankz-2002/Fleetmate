import React, { useState, useEffect } from "react";
import {
    TextField,
    Button,
    MenuItem,
    Stack,
    Typography,
} from "@mui/material";
import { getVehicles } from "../services/allApis"; // Or your actual fetch function
import { appointmentCreate } from "../services/allApis";
import type { Vehicle } from "../types/Vehicles";

interface AppointmentFormProps {
    onSuccess: (appointment: any) => void;
    onCancel: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ onSuccess, onCancel }) => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [selectedVehicleId, setSelectedVehicleId] = useState<number | "">("");
    const [appointmentDate, setAppointmentDate] = useState("");
    const [remarks, setRemarks] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const res = await getVehicles();
                setVehicles(res.data || []);
            } catch (err) {
                console.error("Failed to fetch vehicles:", err);
            }
        };
        fetchVehicles();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!selectedVehicleId || !appointmentDate) {
            setError("Please fill all required fields.");
            return;
        }

        try {
            const res = await appointmentCreate(Number(selectedVehicleId), {
                appointmentDate,
                remarks, 
            });
            onSuccess(res.data.result || res.data);
        } catch (err: any) {
            console.error("Appointment creation failed:", err);
            setError(err.response?.data?.error || "Failed to create appointment.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
                <Typography variant="body1">Select Vehicle</Typography>
                <TextField
                    select
                    fullWidth
                    label="Vehicle"
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(Number(e.target.value))}
                    required
                >
                    {vehicles.map((v) => (
                        <MenuItem key={v.id} value={v.id}>
                            {v.make} {v.model} ({v.regNumber})
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    type="date"
                    fullWidth
                    label="Appointment Date"
                    InputLabelProps={{ shrink: true }}
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    required
                />

                {/* ✅ Remarks field */}
                <TextField
                    label="Remarks"
                    fullWidth
                    multiline
                    rows={3}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Optional comments or instructions"
                />

                {error && (
                    <Typography variant="body2" color="error">
                        {error}
                    </Typography>
                )}

                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                    <Button variant="outlined" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button variant="contained" type="submit">
                        Book
                    </Button>
                </Stack>
            </Stack>
        </form>
    );
};

export default AppointmentForm;
