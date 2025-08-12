import  { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Grid } from '@mui/material';
import MechanicCard from '../components/MechanicCard';
import { findMechanic } from '../services/allApis';

const MechanicsPage = () => {
    const [mechanics, setMechanics] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMechanics = async () => {
            try {
                const res = await findMechanic();
                setMechanics(res.data.result || []);
            } catch (error) {
                console.error("Failed to fetch mechanics", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMechanics();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box p={2}>
            <Typography variant="h5" gutterBottom>
                Available Mechanics
            </Typography>
            {mechanics.length === 0 ? (
                <Typography color="text.secondary">No available mechanics found.</Typography>
            ) : (
                <Grid container spacing={2}>
                    {mechanics.map((mechanic, idx) => (
                        <Grid size={{xs:12,sm:6,md:4}} key={idx}> 
                            <MechanicCard  mechanic={mechanic} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default MechanicsPage;
