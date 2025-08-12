import { useState } from "react";
import {
    TextField,
    Button,
    Box,
    Typography,
    Paper,
    Select,
    InputLabel,
    MenuItem,
    FormControl,
    Fade,
    Snackbar, Alert
} from "@mui/material";
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { useNavigate } from "react-router-dom";

import { registerUser } from "../services/allApis";

function Register() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            email: Yup.string()
                .email('Invalid email address')
                .matches(/^[\w.%+-]+@[A-Za-z0-9.-]+\.(com|in|net|org)$/, 'Must end with .com/.in/.net/.org')
                .required('Email is required'),
            password: Yup.string()
                .min(5, 'At least 5 characters')
                .matches(/[!@#$%^&*(),.?":{}|<>]/, 'At least one special character required')
                .required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), ''], 'Passwords must match')
                .required('Confirm password is required'),
            role: Yup.string().required('Role is required'),
        }),
        onSubmit: async (values, { resetForm }) => {
            setLoading(true);
            try {
                const response = await registerUser(values);
                setMsg(response.data?.msg || "Registration successful!");
                setSnackSeverity("success");
                setSnackOpen(true);
                resetForm();
                setTimeout(() => navigate("/login"), 2000);
            } catch (err: any) {
                setMsg(err.data?.msg || "Registration failed");
                setSnackSeverity("error");
                setSnackOpen(true);
            } finally {
                setLoading(false);
            }
        }
    });

    const [snackOpen, setSnackOpen] = useState(false);
    const [snackSeverity, setSnackSeverity] = useState<"success" | "error">("success");


    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);


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
                        Create Account
                    </Typography>

                    <form onSubmit={formik.handleSubmit}>
                        <TextField
                            fullWidth
                            name="name"  // Add this
                            label="Name"
                            variant="outlined"
                            required
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
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

                        {/* Apply the same sx prop to all TextField components */}
                        <TextField
                            fullWidth
                            name="email"
                            label="Email"
                            type="email"
                            variant="outlined"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
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
                            name="password"

                            label="Password"
                            type="password"
                            variant="outlined"
                            required
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
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
                            name="confirmPassword"

                            label="Confirm Password"
                            type="password"
                            variant="outlined"
                            required
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
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

                        <FormControl fullWidth margin="normal" required>
                            <InputLabel
                                id="role-label"
                                sx={{
                                    color: 'rgba(255,255,255,0.7)',
                                    '&.Mui-focused': {
                                        color: '#00ff9d',
                                    },
                                }}
                            >
                                Role
                            </InputLabel>
                            <Select
                                name="role"

                                labelId="role-label"
                                id="role"
                                label="role"
                                value={formik.values.role}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.role && Boolean(formik.errors.role)}
                                sx={{
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'rgba(255,255,255,0.2)',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'rgba(0, 255, 157, 0.5)',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#00ff9d',
                                    },
                                    '& .MuiSelect-icon': {
                                        color: 'rgba(255,255,255,0.7)',
                                    },
                                }}
                            >
                                <MenuItem value="customer">Customer</MenuItem>
                                <MenuItem value="mechanic">Mechanic</MenuItem>
                                <MenuItem value="manager">Manager</MenuItem>
                            </Select>
                            {formik.touched.role && formik.errors.role && (
                                <Typography variant="caption" color="error" mt={0.5}>
                                    {formik.errors.role}
                                </Typography>
                            )}

                        </FormControl>


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
                            {loading ? 'Registering...' : 'Register Now'}
                        </Button>
                    </form>
                    <Typography
                        mt={2}
                        textAlign="center"
                        color="rgba(255,255,255,0.7)"
                        sx={{ cursor: "pointer", '&:hover': { textDecoration: 'underline', color: '#00ff9d' } }}
                        onClick={() => navigate('/login')}
                    >
                        Already have an account? Log in
                    </Typography>

                    <Snackbar
                        open={snackOpen}
                        autoHideDuration={6000}
                        onClose={() => setSnackOpen(false)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    >
                        <Alert
                            onClose={() => setSnackOpen(false)}
                            severity={snackSeverity}
                            sx={{
                                width: '100%',
                                backgroundColor: snackSeverity === 'success'
                                    ? 'rgba(16, 185, 129, 0.9)'
                                    : 'rgba(239, 68, 68, 0.9)',
                                color: 'white',
                                backdropFilter: 'blur(10px)',
                                '& .MuiAlert-icon': {
                                    color: 'white'
                                }
                            }}
                        >
                            {msg}
                        </Alert>
                    </Snackbar>
                </Paper>
            </Fade>
        </Box>


    );
}

export default Register;