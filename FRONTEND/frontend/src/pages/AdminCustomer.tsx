
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
    MenuItem,
    Snackbar,
    Alert,
    CircularProgress,
    Tooltip,
    Avatar,
    useTheme,
    Divider
} from "@mui/material";
import { Edit, Delete, Add, Person } from "@mui/icons-material";
import { createUsers, deleteUsers, getUsersAdmin, updateUsers } from "../services/allApis";

interface Customer {
    id: number;
    name: string;
    email: string;
    role: string;
}

export default function AdminCustomer() {
    const theme = useTheme();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "" });
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const res = await getUsersAdmin();
            setCustomers(res.data.customer || []);
        } catch (error) {
            console.error("Failed to fetch customers", error);
            setSnackbar({ open: true, message: "Failed to fetch users", severity: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleOpenDialog = (customer?: Customer) => {
        if (customer) {
            setEditingCustomer(customer);
            setFormData({
                name: customer.name,
                email: customer.email,
                password: "",
                role: customer.role || "customer"
            });
        } else {
            setEditingCustomer(null);
            setFormData({ name: "", email: "", password: "", role: "customer" });
        }
        setOpenDialog(true);
    };

    const handleSave = async () => {
        try {
            let res;
            if (editingCustomer) {
                const payload: any = {
                    name: formData.name,
                    email: formData.email,
                    role: formData.role
                };
                if (formData.password) {
                    payload.password = formData.password;
                }
                res = await updateUsers(payload, editingCustomer.id);
            } else {
                res = await createUsers(formData);
            }

            setSnackbar({ open: true, message: res.data.msg || "Operation successful", severity: "success" });
            setOpenDialog(false);
            fetchCustomers();
        } catch (error: any) {
            const msg = error?.response?.data?.msg || "Something went wrong";
            setSnackbar({ open: true, message: msg, severity: "error" });
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            const res = await deleteUsers(id);
            setSnackbar({ open: true, message: res.data.msg || "Deleted successfully", severity: "success" });
            fetchCustomers();
        } catch (error: any) {
            const msg = error.response?.data?.msg || "Delete failed";
            setSnackbar({ open: true, message: msg, severity: "error" });
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin': return theme.palette.error.main;
            case 'manager': return theme.palette.warning.main;
            case 'mechanic': return theme.palette.info.main;
            default: return theme.palette.success.main;
        }
    };

    return (
        <Box sx={{ p: 4, backgroundColor: theme.palette.background.default }}>
            <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h4" fontWeight="bold">
                        User Management
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
                        Add New User
                    </Button>
                </Box>
                <Divider sx={{ my: 2 }} />
            </Paper>

            <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead sx={{
                            backgroundColor: '#1a1a1a',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                backgroundColor: '#1f1f1f',
                                '& .MuiTableCell-root': {
                                    color: '#ffffff'
                                }
                            },
                            '& .MuiTableCell-root': {
                                borderBottom: '1px solid #00ff9d',
                                color: '#cfcfcf',
                                fontWeight: 500
                            }
                        }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', color: 'common.white' }}>User</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'common.white' }}>Email</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'common.white' }}>Role</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'common.white' }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : customers.length > 0 ? (
                                customers.map((c) => (
                                    <TableRow
                                        key={c.id}
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
                                                <Typography fontWeight="medium">{c.name}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{c.email}</TableCell>
                                        <TableCell>
                                            <Box
                                                sx={{
                                                    display: 'inline-block',
                                                    px: 1.5,
                                                    py: 0.5,
                                                    borderRadius: 1,
                                                    backgroundColor: getRoleColor(c.role) + '22',
                                                    color: getRoleColor(c.role),
                                                    fontWeight: 'medium',
                                                    textTransform: 'capitalize'
                                                }}
                                            >
                                                {c.role}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Edit">
                                                <IconButton
                                                    onClick={() => handleOpenDialog(c)}
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
                                                    onClick={() => handleDelete(c.id)}
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
                                            No users found. Click "Add New User" to create one.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Add/Edit Dialog */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        width: '100%',
                        maxWidth: '500px'
                    }
                }}
            >
                <DialogTitle sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: 'common.white',
                    fontWeight: 'bold',
                    py: 2
                }}>
                    {editingCustomer ? "Edit User" : "Add New User"}
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
                        {!editingCustomer && (
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
                        <TextField
                            select
                            label="User Role"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            fullWidth
                            variant="outlined"
                            size="small"
                        >
                            <MenuItem value="customer">Customer</MenuItem>
                            <MenuItem value="mechanic">Mechanic</MenuItem>
                            <MenuItem value="manager">Manager</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                        </TextField>
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
                        {editingCustomer ? "Save Changes" : "Create User"}
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