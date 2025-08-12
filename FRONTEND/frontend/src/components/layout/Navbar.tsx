import { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
    Logout,
    Notifications as Bell,
    AccountCircle
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '@mui/material/styles';


function Navbar() {
    const theme = useTheme();

    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    if (!user) return null;

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose(); // 👈 Important to close menu

        logout();
        navigate('/login');
    };

    // const handleProfile = () => {
    //     handleClose(); // 👈 Close the menu first

    //     navigate(user.role === 'mechanic' ? '/mechanic-profile' : '/customer-profile');
    // };

    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: theme.palette.background.paper,  // or theme.palette.primary.main
                color: theme.palette.text.primary,
                boxShadow: theme.shadows[1],
                borderBottom: `1px solid ${theme.palette.divider}`,
                zIndex: 1100
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                {/* Logo */}
                <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="primary" // ← uses theme.palette.primary.main
                    sx={{ cursor: 'pointer' }}
                    // onClick={() =>
                    //     navigate(user.role === 'customer' ? '/customer-dashboard' : '/mechanic-dashboard')
                    // }
                >
                    FleetMate
                </Typography>


                <Box display="flex" alignItems="center" gap={2}>
                    {/* Notification Icon */}
                    <IconButton>
                        <Bell fontSize="small" />
                    </IconButton>

                    {/* User Info */}
                    <Box display="flex" flexDirection="column" alignItems="flex-end">
                        <Typography variant="body2" fontWeight={500}>
                            {user.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                            {user.role}
                        </Typography>
                    </Box>

                    {/* Avatar */}
                    <IconButton onClick={handleMenu}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                            <AccountCircle />
                        </Avatar>
                    </IconButton>

                    {/* Menu */}
                    <Menu
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                        {/* <MenuItem onClick={handleProfile}>Profile</MenuItem> */}
                        <Divider />
                        <MenuItem onClick={handleLogout} sx={{ color: '#ef4444' }}>
                            <Logout fontSize="small" sx={{ mr: 1 }} />
                            Logout
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
