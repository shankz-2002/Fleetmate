// // components/MechanicCard.tsx
// import { Card, CardContent, Typography, Stack, Chip } from '@mui/material';

// const MechanicCard = ({ mechanic }: { mechanic: any }) => {
//   return (
//     <Card variant="outlined">
//       <CardContent>
//         <Typography variant="h6" fontWeight="bold">{mechanic.name}</Typography>
//         <Typography variant="body2" color="text.secondary" gutterBottom>
//           Years of Experience: {mechanic.yearsOfExperience}
//         </Typography>
//         <Stack direction="row" spacing={1} flexWrap="wrap">
//           {mechanic.skills.map((skill: string, index: number) => (
//             <Chip key={index} label={skill} size="small" />
//           ))}
//         </Stack>
//       </CardContent>
//     </Card>
//   );
// };

// export default MechanicCard;






import {
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Avatar,
  Box,
  useTheme
} from '@mui/material';
import { Wrench, User, Star } from 'lucide-react';

const MechanicCard = ({ mechanic }: { mechanic: any }) => {
  const theme = useTheme();

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        background: theme.palette.background.paper,
        borderColor: theme.palette.divider,
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: theme.shadows[6]
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: `${theme.palette.primary.light}20`,
              color: theme.palette.primary.main
            }}
          >
            <User size={24} />
          </Avatar>
          <Box>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {mechanic.name}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Star size={16} color={theme.palette.warning.main} />
              <Typography variant="body2" color="text.secondary">
                {mechanic.yearsOfExperience} years experience
              </Typography>
            </Stack>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
          {mechanic.skills.map((skill: string, index: number) => (
            <Chip
              key={index}
              label={skill}
              size="small"
              icon={<Wrench size={14} />}
              sx={{
                borderRadius: 2,
                bgcolor: theme.palette.background.default,
                '& .MuiChip-icon': {
                  color: theme.palette.primary.main,
                  ml: 0.5
                }
              }}
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default MechanicCard;