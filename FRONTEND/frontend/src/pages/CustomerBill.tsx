import { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { customerBill } from '../services/allApis';
import DownloadBillPDF from '../components/BillPDFDocument';

function CustomerBill() {


    const [bills, setBills] = useState([]);

    useEffect(() => {
        const fetchBills = async () => {
            try {
                const res = await customerBill();
                setBills(res.data?.bills || []);
                                console.log("Bill items-------------",res.data)

            } catch (err) {
                console.error("Failed to fetch bills:", err);
            }
        };
        fetchBills();
    }, []);

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>My Bills</Typography>
            {bills.map((bill: any) => (
                <Card key={bill.id} sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6">Customer: {bill.user.name}</Typography>
                        <Typography>Service Date: {bill.appointment.appointmentDate}</Typography>
                        <Typography>Remarks: {bill.appointment.remarks}</Typography>
                        <Typography>Parts Used:</Typography>
                        {bill.parts.map((part: any, i: any) => (
                            <Typography key={i}>
                                - {part.partName} (x{part.quantity}) - ₹{part.cost}
                            </Typography>
                        ))}
                        <Typography>Labor Charge: ₹{bill.laborCharge}</Typography>
                        <Typography>Taxes: ₹{bill.taxes}</Typography>
                        <Typography variant="subtitle1">Total: ₹{bill.totalAmount}</Typography>
                        <Box mt={2}>
                            <DownloadBillPDF bill={bill} />
                        </Box>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
}

export default CustomerBill;
