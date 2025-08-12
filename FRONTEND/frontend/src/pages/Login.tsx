import { useState } from "react";
import { useAuth } from "../context/AuthContext";

import {
    TextField,
    Button,
    Box,
    Typography,
    Paper,
    Link,
    Fade,
    Snackbar,
    Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/allApis";

function Login() {
    const { login } = useAuth();

    const [form, setForm] = useState({
        email: '',
        password: ''
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { email, password } = form;

        setLoading(true);
        try {
            const response = await loginUser({ email, password });
            console.log(response);

            setSnackbar({
                open: true,
                message: response.data?.msg || "Login successful!",
                severity: 'success'
            });
            const token = response.data.accessToken;
            const user = response.data.role;
            login(user, token);
            if (user.role === 'customer') navigate('/customer-dashboard');
            else if (user.role === 'mechanic') navigate('/mechanic-dashboard');
            else if (user.role === 'manager') navigate('/manager-dashboard');
            else if (user.role === 'admin') navigate('/admin-dashboard');;


        } catch (err: any) {
            setSnackbar({
                open: true,
                message: err.data?.msg || "Login failed",
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            sx={{
                background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
                backgroundSize: '400% 400%',
                animation: 'gradient 15s ease infinite',
                '@keyframes gradient': {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                },
            }}
        >
            <Fade in timeout={500}>
                <Paper
                    elevation={24}
                    sx={{
                        p: 4,
                        width: { xs: '90%', sm: 450 },
                        borderRadius: 4,
                        backdropFilter: "blur(16px)",
                        backgroundColor: "rgba(31, 31, 31, 0.8)",
                        border: "1px solid rgba(0, 255, 157, 0.2)",
                        boxShadow: "0 8px 32px rgba(0, 198, 255, 0.1)",
                        color: "white",
                        transform: 'translateY(0)',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: "0 12px 40px rgba(0, 198, 255, 0.15)",
                        }
                    }}
                >
                    <Typography
                        variant="h4"
                        gutterBottom
                        align="center"
                        fontWeight={700}
                        sx={{
                            mb: 3,
                            background: 'linear-gradient(90deg, #00ff9d, #00c6ff)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '0.5px'
                        }}
                    >
                        Welcome Back
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            variant="outlined"
                            required
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            margin="normal"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'rgba(255,255,255,0.2)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'rgba(0, 255, 157, 0.5)',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#00ff9d',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'rgba(255,255,255,0.7)',
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#00ff9d',
                                },
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            variant="outlined"
                            required
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            margin="normal"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'rgba(255,255,255,0.2)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'rgba(0, 255, 157, 0.5)',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#00ff9d',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'rgba(255,255,255,0.7)',
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#00ff9d',
                                },
                            }}
                        />

                        <Box textAlign="right" mt={1}>
                            <Link
                                href="/forgot-password"
                                underline="hover"
                                sx={{
                                    color: 'rgba(0, 198, 255, 0.8)',
                                    fontSize: '0.85rem',
                                    '&:hover': {
                                        color: '#00c6ff',
                                    }
                                }}
                            >
                                Forgot Password?
                            </Link>
                        </Box>

                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            sx={{
                                mt: 3,
                                py: 1.5,
                                borderRadius: 2,
                                background: 'linear-gradient(45deg, #00ff9d 0%, #00c6ff 100%)',
                                color: '#121212',
                                fontWeight: 700,
                                fontSize: '1rem',
                                letterSpacing: '0.5px',
                                boxShadow: '0 4px 15px rgba(0, 255, 157, 0.3)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 20px rgba(0, 255, 157, 0.4)',
                                    background: 'linear-gradient(45deg, #00ff9d 0%, #00c6ff 100%)',
                                },
                                '&.Mui-disabled': {
                                    background: 'rgba(255,255,255,0.1)',
                                    color: 'rgba(255,255,255,0.5)',
                                }
                            }}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </form>

                    <Typography
                        mt={3}
                        textAlign="center"
                        sx={{
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: '0.9rem'
                        }}
                    >
                        Don't have an account?{' '}
                        <Link
                            href="/register"
                            underline="hover"
                            sx={{
                                color: '#00ff9d',
                                fontWeight: 500,
                                '&:hover': {
                                    color: '#00c6ff',
                                }
                            }}
                        >
                            Sign up
                        </Link>
                    </Typography>

                    {/* Snackbar Notification */}
                    <Snackbar
                        open={snackbar.open}
                        autoHideDuration={6000}
                        onClose={handleCloseSnackbar}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    >
                        <Alert
                            onClose={handleCloseSnackbar}
                            severity={snackbar.severity}
                            sx={{
                                width: '100%',
                                backgroundColor: snackbar.severity === 'success'
                                    ? 'rgba(16, 185, 129, 0.9)'
                                    : 'rgba(239, 68, 68, 0.9)',
                                color: 'white',
                                backdropFilter: 'blur(10px)',
                                '& .MuiAlert-icon': {
                                    color: 'white'
                                }
                            }}
                        >
                            {snackbar.message}
                        </Alert>
                    </Snackbar>
                </Paper>
            </Fade>
        </Box>
    );
}

export default Login;