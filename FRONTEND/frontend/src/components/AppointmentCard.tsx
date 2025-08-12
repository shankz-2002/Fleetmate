
import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Stack,
    MenuItem,
    Select,
    Button,
    useTheme,
    Avatar,
    Chip
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { Car, User, Clipboard, Check, Clock, X, Wrench, Calendar } from 'lucide-react';
import type { Appointment } from '../types/Appointment';
import type { SxProps, Theme } from '@mui/material/styles';

interface Mechanic {
    id: number;
    name: string;
}

interface AppointmentCardProps {
    appointment: Appointment;
    showActions?: boolean;
    onStatusUpdate?: (id: number, newStatus: string) => void;
    showMechanicAssignSelect?: boolean;
    mechanics?: Mechanic[];
    onAssignMechanic?: (appointmentId: number, mechanicId: number) => void;
    sx?: SxProps<Theme>;
    showFullRemarks?: boolean;
}

const statusIcons = {
    pending: <Clock size={16} />,
    'in-progress': <Wrench size={16} />,
    completed: <Check size={16} />,
    cancelled: <X size={16} />,
};

const statusColors = {
    pending: 'warning',
    'in-progress': 'primary',
    completed: 'success',
    cancelled: 'error',
};

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
    appointment,
    showActions = false,
    onStatusUpdate,
    showMechanicAssignSelect = false,
    mechanics = [],
    onAssignMechanic,
    sx,
    showFullRemarks = false,
}) => {
    const theme = useTheme();
    const status = appointment.status.toLowerCase().replace(' ', '-');
    const isMechanicAssigned = !!appointment.mechanic;
    const availableMechanics = mechanics || [];

    const handleStatusChange = (e: SelectChangeEvent<string>) => {
        onStatusUpdate?.(appointment.id, e.target.value);
    };

    const handleMechanicChange = (e: SelectChangeEvent<string>) => {
        onAssignMechanic?.(appointment.id, parseInt(e.target.value));
    };

    return (
        <Card
            sx={{
                width: '100%',
                borderRadius: 2,
                background: theme.palette.background.paper,
                mb: 2,
                borderLeft: `4px solid ${theme.palette[statusColors[status as keyof typeof statusColors]]?.main}`,
                ...sx,
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={2}
                    alignItems={{ xs: 'flex-start', md: 'center' }}
                    justifyContent="space-between"
                    flexWrap="wrap"
                    sx={{ width: '100%' }}
                >
                    {/* Status Indicator */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                            sx={{
                                width: 40,
                                height: 40,
                                bgcolor: `${theme.palette[statusColors[status as keyof typeof statusColors]]?.light}20`,
                                color: theme.palette[statusColors[status as keyof typeof statusColors]]?.main,
                                mr: 2
                            }}
                        >
                            {statusIcons[status as keyof typeof statusIcons]}
                        </Avatar>
                    </Box>

                    {/* Date and Time */}
                    <Box minWidth={150}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Calendar size={16} color={theme.palette.text.secondary} />
                            <Typography variant="body2">
                                {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </Typography>
                        </Stack>
                    </Box>

                    {/* Vehicle Info */}
                    <Box flex={1} minWidth={180}>
                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                            <Car size={16} color={theme.palette.text.secondary} />
                            <Typography variant="body2" fontWeight={500}>
                                {appointment.vehicle?.make} {appointment.vehicle?.model}
                                {appointment.vehicle?.year && (
                                    <Box component="span" color="text.secondary" ml={0.5}>
                                        ({appointment.vehicle.year})
                                    </Box>
                                )}
                            </Typography>
                        </Stack>
                        {appointment.vehicle?.regNumber && (
                            <Chip
                                label={appointment.vehicle.regNumber}
                                size="small"
                                sx={{
                                    mt: 0.5,
                                    height: 20,
                                    fontSize: '0.7rem',
                                    bgcolor: theme.palette.background.default
                                }}
                            />
                        )}
                    </Box>

                    {/* Mechanic */}
                    <Box minWidth={120}>
                        {appointment.mechanic ? (
                            <Stack direction="row" spacing={1} alignItems="center">
                                <User size={16} color={theme.palette.text.secondary} />
                                <Typography variant="body2">
                                    {appointment.mechanic.name}
                                </Typography>
                            </Stack>
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                {appointment.status     }
                            </Typography>
                        )}
                    </Box>

                    {/* Remarks */}
                    <Box flex={1} minWidth={200} maxWidth={showFullRemarks ? '100%' : 240}>
                        {appointment.remarks && (
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Clipboard size={16} color={theme.palette.text.secondary} />
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        whiteSpace: showFullRemarks ? 'normal' : 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: showFullRemarks ? 'clip' : 'ellipsis'
                                    }}
                                >
                                    {appointment.remarks}
                                </Typography>
                            </Stack>
                        )}
                    </Box>

                    {/* Actions */}
                    {(showMechanicAssignSelect || showActions) && (
                        <Box minWidth={200}>
                            <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="flex-end">
                                {showMechanicAssignSelect && !isMechanicAssigned && status !== 'cancelled' && (
                                    availableMechanics.length === 0 ? (
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            startIcon={<X size={16} />}
                                            onClick={() => onStatusUpdate?.(appointment.id, "cancelled")}
                                            sx={{
                                                borderRadius: 1,
                                                textTransform: 'none',
                                                px: 1.5,
                                                py: 0.5,
                                                fontSize: '0.75rem'
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    ) : (
                                        <Select
                                            size="small"
                                            displayEmpty
                                            value=""
                                            onChange={handleMechanicChange}
                                            renderValue={() => "Assign Mechanic"}
                                            sx={{
                                                borderRadius: 1,
                                                fontSize: '0.75rem',
                                                minWidth: 140,
                                                '& .MuiSelect-select': {
                                                    py: 0.5,
                                                    px: 1,
                                                    backgroundColor: theme.palette.background.default
                                                }
                                            }}
                                        >
                                            {availableMechanics.map((m) => (
                                                <MenuItem
                                                    key={m.id}
                                                    value={m.id.toString()}
                                                    sx={{ fontSize: '0.75rem' }}
                                                >
                                                    {m.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )
                                )}

                                {showActions && onStatusUpdate && (
                                    <Select
                                        size="small"
                                        value={status}
                                        onChange={handleStatusChange}
                                        sx={{
                                            borderRadius: 1,
                                            fontSize: '0.75rem',
                                            minWidth: 120,
                                            '& .MuiSelect-select': {
                                                py: 0.5,
                                                px: 1,
                                                backgroundColor: theme.palette.background.default
                                            }
                                        }}
                                    >
                                        {Object.entries(statusIcons).map(([key, icon]) => (
                                            <MenuItem
                                                key={key}
                                                value={key}
                                                sx={{ fontSize: '0.75rem' }}
                                            >
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    {React.cloneElement(icon, { size: 14 })}
                                                    <Typography variant="body2">
                                                        {key.charAt(0).toUpperCase() + key.slice(1).replace('-', ' ')}
                                                    </Typography>
                                                </Stack>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            </Stack>
                        </Box>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
};






