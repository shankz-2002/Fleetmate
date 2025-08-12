
import React, { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Stack,
    Button,
} from "@mui/material";
import {
    personalAppointmentsManager,
    createBill,
    createPart,
    updateBill,
    deletePart,
} from "../services/allApis";
import CreateBill from "./CreateBill";
import type { Appointment } from "../types/Appointment";
import type { Part } from "../types/Part";


const ManagerAppointmentBill: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
    const [editMode, setEditMode] = useState(false);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const res = await personalAppointmentsManager();
            setAppointments(res.data.appoint || []);
        } catch (error) {
            console.error("Failed to fetch appointments", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleOpenDialog = (appointmentId: number, isEdit = false) => {
        setSelectedAppointmentId(appointmentId);
        setEditMode(isEdit);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedAppointmentId(null);
        setEditMode(false);
    };

    const handleSubmitBill = async (data: {
        laborCharge: number;
        taxes: number;
        parts: Part[];
    }) => {
        if (!selectedAppointmentId) return;

        const currentAppointment = appointments.find((a) => a.id === selectedAppointmentId);
        const existingBill = currentAppointment?.bill;

        try {
            let billId: number;

            if (editMode && existingBill?.id) {
                // Update bill info
                await updateBill(existingBill.id, {
                    laborCharge: data.laborCharge,
                    taxes: data.taxes,
                });

                const originalParts = existingBill.parts || [];
                const updatedParts = data.parts;

                // Find removed parts (in original but NOT in updated by id)
                const removedParts = originalParts.filter(
                    (original) => !updatedParts.some((updated) => updated.id === original.id)
                );

                // Delete removed parts by id
                for (const removed of removedParts) {
                    if (removed.id) {
                        await deletePart(removed.id);
                    }
                }

                // Add new parts (those without id)
                const newParts = updatedParts.filter((part) => !part.id);
                for (const part of newParts) {
                    await createPart(part, existingBill.id);
                }

                // Optionally: implement update existing parts logic here if supported

                billId = existingBill.id;
            } else {
                // Create new bill
                const res = await createBill(selectedAppointmentId, {
                    laborCharge: data.laborCharge,
                    taxes: data.taxes,
                });
                billId = res.data?.result?.id;
                if (!billId) throw new Error("No bill ID returned");

                // Add all parts as new
                for (const part of data.parts) {
                    await createPart(part, billId);
                }
            }

            alert(`Bill ${editMode ? "updated" : "created"} successfully.`);

            // Refresh appointments & bills with fresh data from backend
            await fetchAppointments();

            handleCloseDialog();
        } catch (err: any) {
            console.error("Bill operation failed:", err);
            alert(err?.data?.msg || "Failed to submit bill");
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Stack spacing={2} p={2}>
            {appointments.length === 0 ? (
                <Typography>No appointments assigned by you.</Typography>
            ) : (
                appointments.map((appt) => (
                    <Card key={appt.id} variant="outlined">
                        <CardContent>
                            <Typography variant="h6">
                                Appointment ID: {appt.id}
                            </Typography>
                            <Typography>
                                Date: {new Date(appt.appointmentDate).toLocaleDateString()}
                            </Typography>
                            <Typography>
                                Vehicle: {appt.vehicle?.make} {appt.vehicle?.model}
                            </Typography>
                            <Typography>
                                Mechanic: {appt.mechanic?.user?.name || "Unassigned"}
                            </Typography>
                            <Typography>Status: {appt.status}</Typography>

                            {/* ✅ Create or Edit Bill Button */}
                            {appt.status?.toLowerCase() === "completed" && !appt.bill && (
                                <Button
                                    variant="contained"
                                    sx={{ mt: 2 }}
                                    onClick={() => handleOpenDialog(appt.id)}
                                >
                                    Create Bill
                                </Button>
                            )}

                            {appt.bill && (
                                <>
                                    <Typography sx={{ mt: 2 }} color="text.secondary">
                                        Bill already created (Total: ₹{appt.bill.totalAmount})
                                    </Typography>
                                    {appt.status?.toLowerCase() === "completed" && (
                                        <Button
                                            variant="outlined"
                                            sx={{ mt: 1 }}
                                            onClick={() => handleOpenDialog(appt.id, true)}
                                        >
                                            Edit Bill
                                        </Button>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>
                ))
            )}

            {/* ✅ Bill Dialog */}
            <CreateBill
                open={openDialog}
                onClose={handleCloseDialog}
                onSubmit={handleSubmitBill}
                appointmentId={selectedAppointmentId}
                bill={
                    editMode
                        ? (() => {
                            const appointment = appointments.find((a) => a.id === selectedAppointmentId);
                            const bill = appointment?.bill;
                            if (!bill) return null;

                            // Deep clone parts including id
                            return {
                                ...bill,
                                parts: bill.parts ? [...bill.parts.map(p => ({ ...p }))] : [],
                            };
                        })()
                        : null
                }
                isEdit={editMode}  // <-- Add this prop here
            />

        </Stack>
    );
};

export default ManagerAppointmentBill;

