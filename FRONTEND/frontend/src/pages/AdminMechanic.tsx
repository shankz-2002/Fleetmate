// import { useEffect, useState } from "react";
// import {
//     Box,
//     Button,
//     Typography,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper,
//     IconButton,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     TextField,
//     Snackbar,
//     Alert,
// } from "@mui/material";
// import { Edit, Delete, Add } from "@mui/icons-material";
// import { createUsers, deleteUsers, getUsersAdmin, updateUsers } from "../services/allApis";

// interface Mechanic {
//     id: number;
//     name: string;
//     email: string;
//     role: string; // will always be "mechanic"
// }

// export default function AdminMechanic() {
//     const [mechanics, setMechanics] = useState<Mechanic[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [openDialog, setOpenDialog] = useState(false);
//     const [editingMechanic, setEditingMechanic] = useState<Mechanic | null>(null);
//     const [formData, setFormData] = useState({ name: "", email: "", password: "" });
//     const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

//     // Fetch mechanics list
//     const fetchMechanics = async () => {
//         try {
//             setLoading(true);
//             const res = await getUsersAdmin();
//             setMechanics(res.data.mechanic || []);
//         } catch (error) {
//             console.error("Failed to fetch mechanics", error);
//             setSnackbar({ open: true, message: "Failed to fetch mechanics", severity: "error" });
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchMechanics();
//     }, []);

//     // Open add/edit dialog
//     const handleOpenDialog = (mechanic?: Mechanic) => {
//         if (mechanic) {
//             setEditingMechanic(mechanic);
//             setFormData({
//                 name: mechanic.name,
//                 email: mechanic.email,
//                 password: "", // password left blank on edit
//             });
//         } else {
//             setEditingMechanic(null);
//             setFormData({ name: "", email: "", password: "" });
//         }
//         setOpenDialog(true);
//     };

//     // Save mechanic (create or update)
//     const handleSave = async () => {
//         try {
//             let res;
//             if (editingMechanic) {
//                 // Update mechanic (role fixed to mechanic)
//                 const payload: any = {
//                     name: formData.name,
//                     email: formData.email,
//                     role: "mechanic",
//                 };
//                 if (formData.password) payload.password = formData.password;
//                 res = await updateUsers(payload, editingMechanic.id);
//             } else {
//                 // Create new mechanic (role fixed to mechanic)
//                 res = await createUsers({ ...formData, role: "mechanic" });
//             }
//             setSnackbar({ open: true, message: res.data.msg || "Operation successful", severity: "success" });
//             setOpenDialog(false);
//             fetchMechanics();
//         } catch (error: any) {
//             const msg = error.response?.data?.msg || "Something went wrong";
//             setSnackbar({ open: true, message: msg, severity: "error" });
//         }
//     };

//     // Delete mechanic
//     const handleDelete = async (id: number) => {
//         if (!window.confirm("Are you sure you want to delete this mechanic?")) return;
//         try {
//             const res = await deleteUsers(id);
//             setSnackbar({ open: true, message: res.data.msg || "Deleted successfully", severity: "success" });
//             fetchMechanics();
//         } catch (error: any) {
//             const msg = error.response?.data?.msg || "Delete failed";
//             setSnackbar({ open: true, message: msg, severity: "error" });
//         }
//     };

//     return (
//         <Box p={3}>
//             <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//                 <Typography variant="h4">Manage Mechanics</Typography>
//                 <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
//                     Add Mechanic
//                 </Button>
//             </Box>

//             <TableContainer component={Paper}>
//                 <Table>
//                     <TableHead>
//                         <TableRow>
//                             <TableCell><strong>Name</strong></TableCell>
//                             <TableCell><strong>Email</strong></TableCell>
//                             <TableCell><strong>Role</strong></TableCell>
//                             <TableCell><strong>Actions</strong></TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {loading ? (
//                             <TableRow>
//                                 <TableCell colSpan={4}>Loading...</TableCell>
//                             </TableRow>
//                         ) : mechanics.length > 0 ? (
//                             mechanics.map((m) => (
//                                 <TableRow key={m.id}>
//                                     <TableCell>{m.name}</TableCell>
//                                     <TableCell>{m.email}</TableCell>
//                                     <TableCell>{m.role}</TableCell>
//                                     <TableCell>
//                                         <IconButton onClick={() => handleOpenDialog(m)}><Edit /></IconButton>
//                                         <IconButton onClick={() => handleDelete(m.id)}><Delete /></IconButton>
//                                     </TableCell>
//                                 </TableRow>
//                             ))
//                         ) : (
//                             <TableRow>
//                                 <TableCell colSpan={4}>No mechanics found</TableCell>
//                             </TableRow>
//                         )}
//                     </TableBody>
//                 </Table>
//             </TableContainer>

//             {/* Add/Edit Dialog */}
//             <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
//                 <DialogTitle>{editingMechanic ? "Edit Mechanic" : "Add Mechanic"}</DialogTitle>
//                 <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
//                     <TextField
//                         label="Name"
//                         value={formData.name}
//                         onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                         fullWidth
//                     />
//                     <TextField
//                         label="Email"
//                         value={formData.email}
//                         onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                         fullWidth
//                     />
//                     {!editingMechanic && (
//                         <TextField
//                             label="Password"
//                             type="password"
//                             value={formData.password}
//                             onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                             fullWidth
//                         />
//                     )}
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
//                     <Button variant="contained" onClick={handleSave}>
//                         {editingMechanic ? "Update" : "Add"}
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             {/* Snackbar */}
//             <Snackbar
//                 open={snackbar.open}
//                 autoHideDuration={3000}
//                 onClose={() => setSnackbar({ ...snackbar, open: false })}
//                 anchorOrigin={{ vertical: "top", horizontal: "center" }}
//             >
//                 <Alert severity={snackbar.severity as "success" | "error"} sx={{ width: "100%" }}>
//                     {snackbar.message}
//                 </Alert>
//             </Snackbar>
//         </Box>
//     );
// }














import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Snackbar,
    Alert,
    Avatar,
    Tooltip,
    CircularProgress,
    Divider,
    useTheme
} from "@mui/material";
import { Edit, Delete, Add, Engineering } from "@mui/icons-material";
import { createUsers, deleteUsers, getUsersAdmin, updateUsers } from "../services/allApis";

interface Mechanic {
    id: number;
    name: string;
    email: string;
    role: string;
}

export default function AdminMechanic() {
    const theme = useTheme();
    const [mechanics, setMechanics] = useState<Mechanic[]>([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingMechanic, setEditingMechanic] = useState<Mechanic | null>(null);
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success" as "success" | "error" // Add union type here
    });
    const fetchMechanics = async () => {
        try {
            setLoading(true);
            const res = await getUsersAdmin();
            setMechanics(res.data.mechanic || []);
        } catch (error) {
            console.error("Failed to fetch mechanics", error);
            setSnackbar({ open: true, message: "Failed to fetch mechanics", severity: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMechanics();
    }, []);

    const handleOpenDialog = (mechanic?: Mechanic) => {
        if (mechanic) {
            setEditingMechanic(mechanic);
            setFormData({
                name: mechanic.name,
                email: mechanic.email,
                password: "",
            });
        } else {
            setEditingMechanic(null);
            setFormData({ name: "", email: "", password: "" });
        }
        setOpenDialog(true);
    };

    const handleSave = async () => {
        try {
            let res;
            if (editingMechanic) {
                const payload: any = {
                    name: formData.name,
                    email: formData.email,
                    role: "mechanic",
                };
                if (formData.password) payload.password = formData.password;
                res = await updateUsers(payload, editingMechanic.id);
            } else {
                res = await createUsers({ ...formData, role: "mechanic" });
            }
            setSnackbar({ open: true, message: res.data.msg || "Operation successful", severity: "success" });
            setOpenDialog(false);
            fetchMechanics();
        } catch (error: any) {
            const msg = error.data?.msg || "Something went wrong";
            setSnackbar({ open: true, message: msg, severity: "error" });
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this mechanic?")) return;
        try {
            const res = await deleteUsers(id);
            setSnackbar({ open: true, message: res.data.msg || "Deleted successfully", severity: "success" });
            fetchMechanics();
        } catch (error: any) {
            const msg = error.response?.data?.msg || "Delete failed";
            setSnackbar({ open: true, message: msg, severity: "error" });
        }
    };

    return (
        <Box sx={{ p: 4, backgroundColor: theme.palette.background.default }}>
            <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h4" fontWeight="bold">
                        Mechanics Management
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => handleOpenDialog()}
                        sx={{
                            px: 3,
                            py: 1,
                            textTransform: 'none',
                            borderRadius: 1,
                            boxShadow: 'none',
                            '&:hover': {
                                boxShadow: 'none',
                                transform: 'translateY(-2px)'
                            }
                        }}
                    >
                        Add Mechanic
                    </Button>
                </Box>
                <Divider sx={{ my: 2 }} />
            </Paper>

            <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead sx={{
                            background: 'linear-gradient(to right, #1f1f1f, #2a2a2a)',
                            borderBottom: '2px solid #00ff9d',
                            '& .MuiTableCell-root': {
                                color: '#00ff9d',
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                letterSpacing: '0.5px',
                                textTransform: 'uppercase'
                            }
                        }}>
                            <TableRow>
                                <TableCell>Mechanic</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : mechanics.length > 0 ? (
                                mechanics.map((m) => (
                                    <TableRow
                                        key={m.id}
                                        hover
                                        sx={{
                                            '&:last-child td': { borderBottom: 0 },
                                            '&:hover': { backgroundColor: theme.palette.action.hover }
                                        }}
                                    >
                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={2}>
                                                <Avatar sx={{ bgcolor: theme.palette.warning.main }}>
                                                    <Engineering />
                                                </Avatar>
                                                <Typography fontWeight="medium">{m.name}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{m.email}</TableCell>
                                        <TableCell>
                                            <Box
                                                sx={{
                                                    display: 'inline-block',
                                                    px: 1.5,
                                                    py: 0.5,
                                                    borderRadius: 1,
                                                    backgroundColor: theme.palette.warning.main + '22',
                                                    color: theme.palette.warning.main,
                                                    fontWeight: 'medium',
                                                    textTransform: 'capitalize'
                                                }}
                                            >
                                                {m.role}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Edit">
                                                <IconButton
                                                    onClick={() => handleOpenDialog(m)}
                                                    sx={{
                                                        color: theme.palette.primary.main,
                                                        '&:hover': { backgroundColor: theme.palette.primary.light + '22' }
                                                    }}
                                                >
                                                    <Edit />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton
                                                    onClick={() => handleDelete(m.id)}
                                                    sx={{
                                                        color: theme.palette.error.main,
                                                        '&:hover': { backgroundColor: theme.palette.error.light + '22' }
                                                    }}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                                        <Typography variant="body1" color="text.secondary">
                                            No mechanics found. Click "Add Mechanic" to create one.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        width: '100%',
                        maxWidth: '500px',
                        background: theme.palette.background.paper
                    }
                }}
            >
                <DialogTitle sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: 'common.white',
                    fontWeight: 'bold',
                    py: 2
                }}>
                    {editingMechanic ? "Edit Mechanic" : "Add New Mechanic"}
                </DialogTitle>
                <DialogContent sx={{ p: 3 }}>
                    <Box display="flex" flexDirection="column" gap={3} mt={2}>
                        <TextField
                            label="Full Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            fullWidth
                            variant="outlined"
                            size="small"
                        />
                        <TextField
                            label="Email Address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            fullWidth
                            variant="outlined"
                            size="small"
                        />
                        {!editingMechanic && (
                            <TextField
                                label="Password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                fullWidth
                                variant="outlined"
                                size="small"
                            />
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={() => setOpenDialog(false)}
                        sx={{
                            color: theme.palette.text.secondary,
                            '&:hover': {
                                backgroundColor: theme.palette.action.hover
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        sx={{
                            px: 3,
                            textTransform: 'none',
                            borderRadius: 1,
                            boxShadow: 'none',
                            '&:hover': {
                                boxShadow: 'none'
                            }
                        }}
                    >
                        {editingMechanic ? "Save Changes" : "Create Mechanic"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={5000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    severity={snackbar.severity}
                    sx={{
                        width: "100%",
                        borderRadius: 1,
                        boxShadow: theme.shadows[3]
                    }}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}