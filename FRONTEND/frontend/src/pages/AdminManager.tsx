
// import { useEffect, useState } from "react";
// import {
//     Box,
//     Typography,
//     Table,
//     TableHead,
//     TableRow,
//     TableCell,
//     TableBody,
//     IconButton,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     TextField,
//     Button,
//     Snackbar,
//     Alert,
//     Select,
//     MenuItem,
//     FormControl,
//     InputLabel,
// } from "@mui/material";
// import { Edit, Delete, Add } from "@mui/icons-material";
// import { createUsers, deleteUsers, getUsersAdmin, updateUsers } from "../services/allApis";

// function AdminManager() {
//     const [managers, setManagers] = useState<any[]>([]);
//     const [loading, setLoading] = useState(true);

//     const [editOpen, setEditOpen] = useState(false);
//     const [createOpen, setCreateOpen] = useState(false);

//     const [selectedManager, setSelectedManager] = useState<any>(null);
//     const [formData, setFormData] = useState({ name: "", email: "", role: "manager" });
//     const [createData, setCreateData] = useState({ name: "", email: "", password: "", role: "manager" });

//     const [snackbar, setSnackbar] = useState({
//         open: false,
//         message: "",
//         severity: "success",
//     });

//     // Fetch managers
//     const fetchManagers = async () => {
//         try {
//             setLoading(true);
//             const res = await getUsersAdmin();
//             setManagers(res.data.manager || []);
//         } catch (error) {
//             console.error(error);
//             setSnackbar({
//                 open: true,
//                 message: "Failed to fetch managers",
//                 severity: "error",
//             });
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchManagers();
//     }, []);

//     // Open edit
//     const handleEdit = (manager: any) => {
//         setSelectedManager(manager);
//         setFormData({
//             name: manager.name,
//             email: manager.email,
//             role: manager.role,
//         });
//         setEditOpen(true);
//     };

//     // Update manager
//     const handleUpdate = async () => {
//         try {
//             const res = await updateUsers(formData, selectedManager.id);
//             setSnackbar({
//                 open: true,
//                 message: res.data.msg || "Manager updated successfully",
//                 severity: "success",
//             });
//             setEditOpen(false);
//             fetchManagers();
//         } catch (error: any) {
//             console.error(error);
//             setSnackbar({
//                 open: true,
//                 message: error?.response?.data?.msg || "Update failed",
//                 severity: "error",
//             });
//         }
//     };

//     // Create manager
//     const handleCreate = async () => {
//         try {
//             const res = await createUsers(createData);
//             setSnackbar({
//                 open: true,
//                 message: res.data.msg || "Manager created successfully",
//                 severity: "success",
//             });
//             setCreateOpen(false);
//             setCreateData({ name: "", email: "", password: "", role: "manager" });
//             fetchManagers();
//         } catch (error: any) {
//             console.error(error);
//             setSnackbar({
//                 open: true,
//                 message: error?.response?.data?.msg || "Create failed",
//                 severity: "error",
//             });
//         }
//     };

//     // Delete manager
//     const handleDelete = async (id: number) => {
//         if (!window.confirm("Are you sure you want to delete this manager?")) return;
//         try {
//             const res = await deleteUsers(id);
//             setSnackbar({
//                 open: true,
//                 message: res.data.msg || "Manager deleted successfully",
//                 severity: "success",
//             });
//             fetchManagers();
//         } catch (error: any) {
//             console.error(error);
//             setSnackbar({
//                 open: true,
//                 message: error.response?.data?.msg || "Delete failed",
//                 severity: "error",
//             });
//         }
//     };

//     return (
//         <Box p={3}>
//             <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//                 <Typography variant="h4">Manage Managers</Typography>
//                 <Button
//                     variant="contained"
//                     startIcon={<Add />}
//                     onClick={() => setCreateOpen(true)}
//                 >
//                     Create Manager
//                 </Button>
//             </Box>

//             {loading ? (
//                 <Typography>Loading...</Typography>
//             ) : managers.length === 0 ? (
//                 <Typography>No managers found.</Typography>
//             ) : (
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
//                         {managers.map((manager) => (
//                             <TableRow key={manager.id}>
//                                 <TableCell>{manager.name}</TableCell>
//                                 <TableCell>{manager.email}</TableCell>
//                                 <TableCell>{manager.role}</TableCell>
//                                 <TableCell>
//                                     <IconButton color="primary" onClick={() => handleEdit(manager)}>
//                                         <Edit />
//                                     </IconButton>
//                                     <IconButton color="error" onClick={() => handleDelete(manager.id)}>
//                                         <Delete />
//                                     </IconButton>
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             )}

//             {/* Edit Dialog */}
//             <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
//                 <DialogTitle>Edit Manager</DialogTitle>
//                 <DialogContent>
//                     <TextField
//                         fullWidth
//                         margin="dense"
//                         label="Name"
//                         value={formData.name}
//                         onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                     />
//                     <TextField
//                         fullWidth
//                         margin="dense"
//                         label="Email"
//                         value={formData.email}
//                         onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                     />
//                     <FormControl fullWidth margin="dense">
//                         <InputLabel>Role</InputLabel>
//                         <Select
//                             value={formData.role}
//                             onChange={(e) => setFormData({ ...formData, role: e.target.value })}
//                         >
//                             <MenuItem value="manager">Manager</MenuItem>
//                             <MenuItem value="admin">Admin</MenuItem>
//                             <MenuItem value="customer">Customer</MenuItem>
//                         </Select>
//                     </FormControl>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setEditOpen(false)}>Cancel</Button>
//                     <Button variant="contained" color="primary" onClick={handleUpdate}>
//                         Save
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             {/* Create Dialog */}
//             <Dialog open={createOpen} onClose={() => setCreateOpen(false)}>
//                 <DialogTitle>Create Manager</DialogTitle>
//                 <DialogContent>
//                     <TextField
//                         fullWidth
//                         margin="dense"
//                         label="Name"
//                         value={createData.name}
//                         onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
//                     />
//                     <TextField
//                         fullWidth
//                         margin="dense"
//                         label="Email"
//                         value={createData.email}
//                         onChange={(e) => setCreateData({ ...createData, email: e.target.value })}
//                     />
//                     <TextField
//                         fullWidth
//                         type="password"
//                         margin="dense"
//                         label="Password"
//                         value={createData.password}
//                         onChange={(e) => setCreateData({ ...createData, password: e.target.value })}
//                     />
//                     <FormControl fullWidth margin="dense">
//                         <InputLabel>Role</InputLabel>
//                         <Select
//                             value={createData.role}
//                             onChange={(e) => setCreateData({ ...createData, role: e.target.value })}
//                         >
//                             <MenuItem value="manager">Manager</MenuItem>
//                             <MenuItem value="admin">Admin</MenuItem>
//                             <MenuItem value="customer">Customer</MenuItem>
//                         </Select>
//                     </FormControl>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
//                     <Button variant="contained" color="primary" onClick={handleCreate}>
//                         Create
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             {/* Snackbar */}
//             <Snackbar
//                 open={snackbar.open}
//                 autoHideDuration={4000}
//                 onClose={() => setSnackbar({ ...snackbar, open: false })}
//             >
//                 <Alert severity={snackbar.severity as any}>{snackbar.message}</Alert>
//             </Snackbar>
//         </Box>
//     );
// }

// export default AdminManager;








import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Snackbar,
    Alert,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Paper,
    CircularProgress,
    Avatar,
    Divider,
    Tooltip,
    TableContainer,
    useTheme
} from "@mui/material";
import { Edit, Delete, Add, Person } from "@mui/icons-material";
import { createUsers, deleteUsers, getUsersAdmin, updateUsers } from "../services/allApis";

function AdminManager() {
    const theme = useTheme();
    const [managers, setManagers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [editOpen, setEditOpen] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);

    const [selectedManager, setSelectedManager] = useState<any>(null);
    const [formData, setFormData] = useState({ name: "", email: "", role: "manager" });
    const [createData, setCreateData] = useState({ name: "", email: "", password: "", role: "manager" });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const fetchManagers = async () => {
        try {
            setLoading(true);
            const res = await getUsersAdmin();
            setManagers(res.data.manager || []);
        } catch (error) {
            console.error(error);
            setSnackbar({
                open: true,
                message: "Failed to fetch managers",
                severity: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchManagers();
    }, []);

    const handleEdit = (manager: any) => {
        setSelectedManager(manager);
        setFormData({
            name: manager.name,
            email: manager.email,
            role: manager.role,
        });
        setEditOpen(true);
    };

    const handleUpdate = async () => {
        try {
            const res = await updateUsers(formData, selectedManager.id);
            setSnackbar({
                open: true,
                message: res.data.msg || "Manager updated successfully",
                severity: "success",
            });
            setEditOpen(false);
            fetchManagers();
        } catch (error: any) {
            console.error(error);
            setSnackbar({
                open: true,
                message: error?.response?.data?.msg || "Update failed",
                severity: "error",
            });
        }
    };

    const handleCreate = async () => {
        try {
            const res = await createUsers(createData);
            setSnackbar({
                open: true,
                message: res.data.msg || "Manager created successfully",
                severity: "success",
            });
            setCreateOpen(false);
            setCreateData({ name: "", email: "", password: "", role: "manager" });
            fetchManagers();
        } catch (error: any) {
            console.error(error);
            setSnackbar({
                open: true,
                message: error?.response?.data?.msg || "Create failed",
                severity: "error",
            });
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this manager?")) return;
        try {
            const res = await deleteUsers(id);
            setSnackbar({
                open: true,
                message: res.data.msg || "Manager deleted successfully",
                severity: "success",
            });
            fetchManagers();
        } catch (error: any) {
            console.error(error);
            setSnackbar({
                open: true,
                message: error.response?.data?.msg || "Delete failed",
                severity: "error",
            });
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin': return theme.palette.error.main;
            case 'manager': return theme.palette.primary.main;
            default: return theme.palette.success.main;
        }
    };

    return (
        <Box sx={{ p: 4, backgroundColor: theme.palette.background.default }}>
            <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h4" fontWeight="bold">
                        Manager Management
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setCreateOpen(true)}
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
                        Add New Manager
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
                                <TableCell>User</TableCell>
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
                            ) : managers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                                        <Typography variant="body1" color="text.secondary">
                                            No managers found. Click "Add New Manager" to create one.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                managers.map((manager) => (
                                    <TableRow
                                        key={manager.id}
                                        hover
                                        sx={{
                                            '&:last-child td': { borderBottom: 0 },
                                            '&:hover': { backgroundColor: theme.palette.action.hover }
                                        }}
                                    >
                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={2}>
                                                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                                                    <Person />
                                                </Avatar>
                                                <Typography fontWeight="medium">{manager.name}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{manager.email}</TableCell>
                                        <TableCell>
                                            <Box
                                                sx={{
                                                    display: 'inline-block',
                                                    px: 1.5,
                                                    py: 0.5,
                                                    borderRadius: 1,
                                                    backgroundColor: getRoleColor(manager.role) + '22',
                                                    color: getRoleColor(manager.role),
                                                    fontWeight: 'medium',
                                                    textTransform: 'capitalize'
                                                }}
                                            >
                                                {manager.role}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Edit">
                                                <IconButton
                                                    onClick={() => handleEdit(manager)}
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
                                                    onClick={() => handleDelete(manager.id)}
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
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Edit Dialog */}
            <Dialog
                open={editOpen}
                onClose={() => setEditOpen(false)}
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
                    Edit Manager
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
                        <FormControl fullWidth size="small">
                            <InputLabel>User Role</InputLabel>
                            <Select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                label="User Role"
                            >
                                <MenuItem value="manager">Manager</MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                                <MenuItem value="customer">Customer</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={() => setEditOpen(false)}
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
                        onClick={handleUpdate}
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
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Create Dialog */}
            <Dialog
                open={createOpen}
                onClose={() => setCreateOpen(false)}
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
                    Create New Manager
                </DialogTitle>
                <DialogContent sx={{ p: 3 }}>
                    <Box display="flex" flexDirection="column" gap={3} mt={2}>
                        <TextField
                            label="Full Name"
                            value={createData.name}
                            onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
                            fullWidth
                            variant="outlined"
                            size="small"
                        />
                        <TextField
                            label="Email Address"
                            value={createData.email}
                            onChange={(e) => setCreateData({ ...createData, email: e.target.value })}
                            fullWidth
                            variant="outlined"
                            size="small"
                        />
                        <TextField
                            label="Password"
                            type="password"
                            value={createData.password}
                            onChange={(e) => setCreateData({ ...createData, password: e.target.value })}
                            fullWidth
                            variant="outlined"
                            size="small"
                        />
                        <FormControl fullWidth size="small">
                            <InputLabel>User Role</InputLabel>
                            <Select
                                value={createData.role}
                                onChange={(e) => setCreateData({ ...createData, role: e.target.value })}
                                label="User Role"
                            >
                                <MenuItem value="manager">Manager</MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                                <MenuItem value="customer">Customer</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={() => setCreateOpen(false)}
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
                        onClick={handleCreate}
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
                        Create Manager
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={5000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    severity={snackbar.severity as "success" | "error"}
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

export default AdminManager;