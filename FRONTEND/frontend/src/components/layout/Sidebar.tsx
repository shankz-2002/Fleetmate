import {
    Box,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Divider,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    DirectionsCar,
    EventNote,
    Receipt,
    Settings,
    Group,
    BarChart,
    Build,
    Person,
    ManageAccounts,
} from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Wrench } from 'lucide-react';

const Sidebar = () => {
    const { user } = useAuth();

    const getNavItems = () => {
        let dashboardItem;

        switch (user?.role) {
            case 'admin':
                dashboardItem = { label: 'Dashboard', path: '/admin-dashboard', icon: <DashboardIcon /> };
                return [
                    dashboardItem,
                    { label: 'Customers', path: '/admin-users', icon: <Group /> },
                    { label: 'Managers', path: '/admin-managers', icon: <ManageAccounts /> },
                    { label: 'Mechanics', path: '/admin-mechanics', icon: <Wrench /> },
                    { label: 'Appointments', path: '/appointments', icon: <EventNote /> },
                    { label: 'Vehicles', path: '/admin-vehicles', icon: <DirectionsCar /> },
                    { label: 'Bills', path: '/admin-bills', icon: <Receipt /> },
                    { label: 'Analytics', path: '/analytics', icon: <BarChart /> },
                    // { label: 'Profile', path: '/profile', icon: <Settings /> },

                ];
            case 'manager':
                dashboardItem = { label: 'Dashboard', path: '/manager-dashboard', icon: <DashboardIcon /> };
                return [
                    dashboardItem,
                    { label: 'Appointments', path: '/appointments', icon: <EventNote /> },
                    { label: 'Mechanics', path: '/mechanics', icon: <Person /> },
                    { label: 'Bills', path: '/manager-bills', icon: <Receipt /> },
                    { label: 'Analytics', path: '/analytics', icon: <BarChart /> },
                ];
            case 'mechanic':
                dashboardItem = { label: 'Dashboard', path: '/mechanic-dashboard', icon: <DashboardIcon /> };
                return [
                    dashboardItem,
                    { label: 'My Tasks', path: '/tasks', icon: <Build /> },
                    { label: 'Profile', path: '/mechanic-profile', icon: <Settings /> },
                ];
            case 'customer':
                dashboardItem = { label: 'Dashboard', path: '/customer-dashboard', icon: <DashboardIcon /> };
                return [
                    dashboardItem,
                    { label: 'My Vehicles', path: '/vehicles', icon: <DirectionsCar /> },
                    { label: 'Appointments', path: 'customer/appointments', icon: <EventNote /> },
                    { label: 'Bills', path: '/customer-bills', icon: <Receipt /> },
                    { label: 'Profile', path: '/customer-profile', icon: <Settings /> },
                ];
            default:
                return [{ label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> }];
        }
    };


    const navItems = getNavItems();

    return (
        <Box
            width={240}
            bgcolor="background.paper"
            borderRight="1px solid #e0e0e0"
            height="100vh"
            position="sticky"
            top={0}
        >
            <Box p={2}>
                <Typography variant="h6" fontWeight="bold" color="primary">
                    FleetMate
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ textTransform: 'capitalize' }}>
                    {user?.role} Panel
                </Typography>
            </Box>

            <Divider />

            <List>
                {navItems.map((item) => (
                    <NavLink
                        to={item.path}
                        key={item.label}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        {({ isActive }) => (
                            <ListItemButton selected={isActive}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        )}
                    </NavLink>
                ))}
            </List>
        </Box>
    );
};

export default Sidebar;
