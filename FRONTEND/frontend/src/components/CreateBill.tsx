import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    IconButton,
    Grid,
    Box,
    Typography,
} from '@mui/material';
import { Trash2 } from 'lucide-react';
import type { Part } from '../types/Part';


interface BillData {
    id: number;
    laborCharge: number;
    taxes: number;
    totalAmount: number;
    parts: Part[];
}

interface CreateBillDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: { laborCharge: number; taxes: number; parts: Part[] }) => Promise<void>;
    appointmentId: number | null;
    bill: BillData | null;
    isEdit: boolean;
}

const CreateBillDialog: React.FC<CreateBillDialogProps> = ({
    open,
    onClose,
    onSubmit,
    bill,
    isEdit,
}) => {
    const [laborCharge, setLaborCharge] = useState<number>(0);
    const [taxes, setTaxes] = useState<number>(0);
    const [parts, setParts] = useState<Part[]>([]);

    const [newPart, setNewPart] = useState<Part>({
        partName: '',
        quantity: 1,
        cost: 0,
    });

    useEffect(() => {
        if (isEdit && bill) {
            setLaborCharge(bill.laborCharge);
            setTaxes(bill.taxes);
            setParts(bill.parts || []);
        } else {
            setLaborCharge(0);
            setTaxes(0);
            setParts([]);
        }
    }, [isEdit, bill, open]);

    const handleAddPart = () => {
        if (!newPart.partName || newPart.quantity <= 0 || newPart.cost <= 0) return;
        setParts((prev) => [...prev, newPart]);
        setNewPart({ partName: '', quantity: 1, cost: 0 });
    };

    const handleDeletePart = (index: number) => {
        setParts((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        await onSubmit({ laborCharge, taxes, parts });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>{isEdit ? 'Edit Bill' : 'Create Bill'}</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                        <TextField
                            label="Labor Charge"
                            type="number"
                            value={laborCharge}
                            onChange={(e) => setLaborCharge(Number(e.target.value))}
                            fullWidth
                        />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                        <TextField
                            label="Taxes"
                            type="number"
                            value={taxes}
                            onChange={(e) => setTaxes(Number(e.target.value))}
                            fullWidth
                        />
                    </Grid>
                </Grid>

                <Box mt={3}>
                    <Typography variant="subtitle1" gutterBottom>
                        Parts Used
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                        <Grid size={{ xs: 4 }}>
                            <TextField
                                label="Part Name"
                                value={newPart.partName}
                                onChange={(e) => setNewPart({ ...newPart, partName: e.target.value })}
                                fullWidth
                            />
                        </Grid>
                        <Grid size={{ xs: 3 }}>
                            <TextField
                                label="Quantity"
                                type="number"
                                value={newPart.quantity}
                                onChange={(e) => setNewPart({ ...newPart, quantity: Number(e.target.value) })}
                                fullWidth
                            />
                        </Grid>
                        <Grid size={{ xs: 3 }}>
                            <TextField
                                label="Cost"
                                type="number"
                                value={newPart.cost}
                                onChange={(e) => setNewPart({ ...newPart, cost: Number(e.target.value) })}
                                fullWidth
                            />
                        </Grid>
                        <Grid size={{ xs: 2 }}>
                            <Button onClick={handleAddPart} variant="contained" color="primary" fullWidth>
                                Add
                            </Button>
                        </Grid>
                    </Grid>

                    {parts.length > 0 && (
                        <Box mt={2}>
                            {parts.map((part, index) => (
                                <Grid container key={index} spacing={2} alignItems="center" sx={{ mb: 1 }}>
                                    <Grid size={{ xs: 4 }}>
                                        <TextField value={part.partName} fullWidth disabled />
                                    </Grid>
                                    <Grid size={{ xs: 3 }}>
                                        <TextField value={part.quantity} type="number" fullWidth disabled />
                                    </Grid>
                                    <Grid size={{ xs: 3 }}>
                                        <TextField value={part.cost} type="number" fullWidth disabled />
                                    </Grid>
                                    <Grid size={{ xs: 2 }}>
                                        <IconButton onClick={() => handleDeletePart(index)} color="error">
                                            <Trash2 size={20} />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            ))}
                        </Box>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    {isEdit ? 'Update Bill' : 'Create Bill'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateBillDialog;
