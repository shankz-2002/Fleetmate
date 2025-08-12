
// // import React, { useEffect, useState } from "react";
// // import {
// //   Box,
// //   Grid,
// //   Typography,
// //   CircularProgress,
// //   Card,
// //   CardContent,
// //   Avatar,
// //   Divider,
// //   Stack,
// // } from "@mui/material";
// // import {
// //   Build,
// //   CalendarToday,
// //   CheckCircleOutline,
// //   Timer,
// // } from "@mui/icons-material";

// // import { AppointmentCard } from "../../components/AppointmentCard";
// // import { getMechanicAppointment } from "../../services/allApis";
// // import { useAuth } from "../../context/AuthContext";

// // const MechanicDashboard: React.FC = () => {
// //   const { user } = useAuth();
// //   const [appointments, setAppointments] = useState<any[]>([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchAppointments = async () => {
// //       try {
// //         if (!user?.id) return;

// //         const res = await getMechanicAppointment();
// //         setAppointments(res.data.appointments || []);
// //       } catch (error) {
// //         console.error("Failed to fetch appointments:", error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchAppointments();
// //   }, [user?.id]);

// //   if (loading) {
// //     return (
// //       <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
// //         <CircularProgress />
// //       </Box>
// //     );
// //   }
// //   console.log(appointments);


// //   const normalizeStatus = (status: any) => status.toLowerCase().replace(/\s+/g, "-");


// //   const pending = appointments.filter((a) => normalizeStatus(a.status) === "pending");
// //   const inProgress = appointments.filter((a) => normalizeStatus(a.status) === "in-progress");
// //   const completed = appointments.filter((a) => normalizeStatus(a.status) === "completed");

// //   const stats = [
// //     {
// //       name: "Pending Tasks",
// //       value: pending.length,
// //       icon: <Timer />,
// //       color: "warning.main",
// //     },
// //     {
// //       name: "In Progress",
// //       value: inProgress.length,
// //       icon: <Build />,
// //       color: "info.main",
// //     },
// //     {
// //       name: "Completed Services",
// //       value: completed.length,
// //       icon: <CheckCircleOutline />,
// //       color: "success.main",
// //     },
// //     {
// //       name: "Total Appointments",
// //       value: appointments.length,
// //       icon: <CalendarToday />,
// //       color: "primary.main",
// //     },
// //   ];

// //   return (
// //     <Box p={{ xs: 2, md: 3 }}>
// //       {/* Header */}
// //       <Box mb={3}>
// //         <Typography variant="h5" fontWeight="bold" gutterBottom>
// //           Mechanic Dashboard
// //         </Typography>
// //         <Typography color="text.secondary">
// //           View and manage your assigned appointments
// //         </Typography>
// //       </Box>

// //       {/* Stats Grid */}
// //       <Grid container spacing={2}>
// //         {stats.map((stat) => (
// //           <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.name}>
// //             <Card>
// //               <CardContent sx={{ display: "flex", alignItems: "center" }}>
// //                 <Avatar sx={{ bgcolor: stat.color, mr: 2 }}>{stat.icon}</Avatar>
// //                 <Box>
// //                   <Typography variant="body2" color="text.secondary">
// //                     {stat.name}
// //                   </Typography>
// //                   <Typography variant="h6">{stat.value}</Typography>
// //                 </Box>
// //               </CardContent>
// //             </Card>
// //           </Grid>
// //         ))}
// //       </Grid>

// //       {/* Task List */}
// //       <Box mt={5}>
// //         <Typography variant="h6" gutterBottom>
// //           My Tasks
// //         </Typography>

// //         <Divider sx={{ mb: 2 }} />

// //         {appointments.length > 0 ? (
// //           <Stack spacing={2}>
// //             {appointments.slice(0, 5).map((appointment) => (
// //               <AppointmentCard key={appointment.id} appointment={appointment} />
// //             ))}
// //           </Stack>
// //         ) : (
// //           <Typography color="text.secondary">No tasks assigned yet.</Typography>
// //         )}
// //       </Box>
// //     </Box>
// //   );
// // };

// // export default MechanicDashboard;












// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Grid,
//   Typography,
//   CircularProgress,
//   Card,
//   CardContent,
//   Avatar,
//   Divider,
//   Stack,
//   Paper,
//   useTheme,
//   Fade,
//   Grow,
//   useMediaQuery
// } from "@mui/material";
// import {
//   Build,
//   CalendarToday,
//   CheckCircleOutline,
//   Timer,
// } from "@mui/icons-material";
// import { Wrench, Clock, CheckCircle, Calendar } from 'lucide-react';
// import { AppointmentCard } from "../../components/AppointmentCard";
// import { getMechanicAppointment } from "../../services/allApis";
// import { useAuth } from "../../context/AuthContext";

// const MechanicDashboard: React.FC = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const { user } = useAuth();
//   const [appointments, setAppointments] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchAppointments = async () => {
//       try {
//         if (!user?.id) return;

//         const res = await getMechanicAppointment();
//         setAppointments(res.data.appointments || []);
//       } catch (error) {
//         console.error("Failed to fetch appointments:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAppointments();
//   }, [user?.id]);

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
//         <CircularProgress color="primary" />
//       </Box>
//     );
//   }

//   const normalizeStatus = (status: any) => status.toLowerCase().replace(/\s+/g, "-");

//   const pending = appointments.filter((a) => normalizeStatus(a.status) === "pending");
//   const inProgress = appointments.filter((a) => normalizeStatus(a.status) === "in-progress");
//   const completed = appointments.filter((a) => normalizeStatus(a.status) === "completed");

//   const stats = [
//     {
//       name: "Pending Tasks",
//       value: pending.length,
//       icon: <Clock size={24} />,
//       color: theme.palette.warning.main,
//       bgColor: theme.palette.warning.light
//     },
//     {
//       name: "In Progress",
//       value: inProgress.length,
//       icon: <Wrench size={24} />,
//       color: theme.palette.info.main,
//       bgColor: theme.palette.info.light
//     },
//     {
//       name: "Completed Services",
//       value: completed.length,
//       icon: <CheckCircle size={24} />,
//       color: theme.palette.success.main,
//       bgColor: theme.palette.success.light
//     },
//     {
//       name: "Total Appointments",
//       value: appointments.length,
//       icon: <Calendar size={24} />,
//       color: theme.palette.primary.main,
//       bgColor: theme.palette.primary.light
//     },
//   ];

//   return (
//     <Box sx={{ p: isMobile ? 2 : 3, background: theme.palette.background.default }}>
//       {/* Header */}
//       <Fade in timeout={500}>
//         <Box mb={4}>
//           <Typography
//             variant={isMobile ? "h4" : "h3"}
//             fontWeight="bold"
//             sx={{
//               background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
//               WebkitBackgroundClip: 'text',
//               WebkitTextFillColor: 'transparent',
//               mb: 1
//             }}
//           >
//             Mechanic Dashboard
//           </Typography>
//           <Typography variant={isMobile ? "body2" : "body1"} color="text.secondary">
//             View and manage your assigned appointments
//           </Typography>
//         </Box>
//       </Fade>

//       {/* Stats Grid */}
//       <Grid container spacing={isMobile ? 2 : 3} mb={4}>
//         {stats.map((stat, index) => (
//           <Grow in timeout={(index + 1) * 300} key={stat.name}>
//             <Grid size={{ xs: 12, sm: 6, md: 3 }}>
//               <Paper
//                 elevation={3}
//                 sx={{
//                   borderRadius: 3,
//                   background: theme.palette.background.paper,
//                   transition: 'transform 0.3s, box-shadow 0.3s',
//                   '&:hover': {
//                     transform: 'translateY(-5px)',
//                     boxShadow: theme.shadows[6]
//                   }
//                 }}
//               >
//                 <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
//                   <Avatar sx={{
//                     bgcolor: stat.bgColor,
//                     color: stat.color,
//                     mr: 3,
//                     width: 48,
//                     height: 48
//                   }}>
//                     {stat.icon}
//                   </Avatar>
//                   <Box>
//                     <Typography variant="body2" color="text.secondary">
//                       {stat.name}
//                     </Typography>
//                     <Typography variant="h4" fontWeight="bold">
//                       {stat.value}
//                     </Typography>
//                   </Box>
//                 </CardContent>
//               </Paper>
//             </Grid>
//           </Grow>
//         ))}
//       </Grid>

//       {/* Task List */}
//       <Grow in timeout={800}>
//         <Box>
//           <Typography variant="h5" fontWeight="bold" gutterBottom>
//             My Tasks
//           </Typography>
//           <Divider sx={{ mb: 3 }} />

//           {appointments.length > 0 ? (
//             <Stack spacing={2}>
//               {appointments.slice(0, 5).map((appointment, index) => (
//                 <Grow in timeout={(index + 1) * 200} key={appointment.id}>
//                   <Box>
//                     <AppointmentCard
//                       appointment={appointment}
//                       sx={{
//                         borderRadius: 3,
//                         background: theme.palette.background.paper,
//                         transition: 'transform 0.3s, box-shadow 0.3s',
//                         '&:hover': {
//                           transform: 'translateY(-2px)',
//                           boxShadow: theme.shadows[4]
//                         }
//                       }}
//                     />
//                   </Box>
//                 </Grow>
//               ))}
//             </Stack>
//           ) : (
//             <Paper
//               elevation={0}
//               sx={{
//                 p: 4,
//                 textAlign: 'center',
//                 borderRadius: 3,
//                 background: theme.palette.background.paper,
//                 border: `1px dashed ${theme.palette.divider}`
//               }}
//             >
//               <Box sx={{
//                 width: 80,
//                 height: 80,
//                 mx: 'auto',
//                 mb: 2,
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 background: `${theme.palette.action.hover}30`,
//                 borderRadius: '50%'
//               }}>
//                 <Wrench size={32} color={theme.palette.text.disabled} />
//               </Box>
//               <Typography variant="h6" color="text.secondary">
//                 No tasks assigned yet
//               </Typography>
//               <Typography variant="body2" color="text.secondary" mt={1}>
//                 You'll see your assigned tasks here
//               </Typography>
//             </Paper>
//           )}
//         </Box>
//       </Grow>
//     </Box>
//   );
// };

// export default MechanicDashboard;







import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  Avatar,
  useTheme,
  Fade,
  Grow,
  Paper,
  useMediaQuery
} from "@mui/material";
import { Wrench, Clock, CheckCircle, Calendar, User } from 'lucide-react';
import { AppointmentCard } from "../../components/AppointmentCard";
import { getMechanicAppointment } from "../../services/allApis";
import { useAuth } from "../../context/AuthContext";

const MechanicDashboard: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (!user?.id) return;

        const res = await getMechanicAppointment();
        console.log(res.data.appointments);

        setAppointments(res.data.appointments || []);

      } catch (error: any) {
        if (error.response) {
          // Backend responded with an error
          console.error(
            "Backend error:",
            error.response.data?.message || JSON.stringify(error.response.data)
          );
        } else if (error.request) {
          // No response from server
          console.error("No response from server:", error.request);
        } else {
          // Something went wrong setting up the request
          console.error("Error setting up request:", error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user?.id]);


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  const normalizeStatus = (status: any) => status.toLowerCase().replace(/\s+/g, "-");



  const pending = appointments.filter((a) => normalizeStatus(a.status) === "pending");
  const inProgress = appointments.filter((a) => normalizeStatus(a.status) === "in-progress");
  const completed = appointments.filter((a) => normalizeStatus(a.status) === "completed");

  const stats = [
    {
      name: "Pending Tasks",
      value: pending.length,
      icon: <Clock size={24} />,
      bgColor: theme.palette.warning.light
    },
    {
      name: "In Progress",
      value: inProgress.length,
      icon: <Wrench size={24} />,
      bgColor: theme.palette.primary.light
    },
    {
      name: "Completed Services",
      value: completed.length,
      icon: <CheckCircle size={24} />,
      bgColor: theme.palette.success.light
    },
    {
      name: "Total Appointments",
      value: appointments.length,
      icon: <Calendar size={24} />,
      bgColor: theme.palette.info.light
    },
  ];

  return (
    <Box p={isSmallScreen ? 2 : 3} sx={{ background: theme.palette.background.default }}>
      {/* Header */}
      <Fade in timeout={500}>
        <Box mb={4}>
          <Typography
            variant={isSmallScreen ? "h4" : "h3"}
            fontWeight="bold"
            sx={{
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}
          >
            Mechanic Dashboard
          </Typography>
          <Typography variant={isSmallScreen ? "body2" : "subtitle1"} color="text.secondary">
            View and manage your assigned appointments
          </Typography>
        </Box>
      </Fade>

      {/* Stats Cards */}
      <Grid container spacing={isSmallScreen ? 2 : 3} mb={4}>
        {stats.map((stat, idx) => (
          <Grow in timeout={(idx + 1) * 300} key={stat.name}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={3}
                sx={{
                  borderRadius: 3,
                  background: theme.palette.background.paper,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme.shadows[6]
                  },
                  position: 'relative',
                  width: '100%',
                  paddingTop: '100%',
                  height: 0
                }}
              >
                <CardContent
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: isSmallScreen ? 1 : 2
                  }}
                >
                  <Avatar sx={{
                    bgcolor: stat.bgColor,
                    width: isSmallScreen ? 40 : 56,
                    height: isSmallScreen ? 40 : 56,
                    mb: 1
                  }}>
                    {stat.icon}
                  </Avatar>
                  <Typography
                    variant={isSmallScreen ? "caption" : "subtitle2"}
                    color="text.secondary"
                    align="center"
                    sx={{ mb: 0.5 }}
                  >
                    {stat.name}
                  </Typography>
                  <Typography
                    variant={isSmallScreen ? "h5" : "h4"}
                    fontWeight="bold"
                    align="center"
                  >
                    {stat.value}
                  </Typography>
                </CardContent>
              </Paper>
            </Grid>
          </Grow>
        ))}
      </Grid>

      {/* Task Sections */}
      <Grid container spacing={isSmallScreen ? 2 : 3} mb={4}>
        {/* Pending Tasks */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Grow in timeout={800}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: 3,
                background: theme.palette.background.paper,
                height: '100%'
              }}
            >
              <CardContent>
                <Typography variant={isSmallScreen ? "h6" : "h5"} fontWeight="bold" mb={1}>
                  Pending Tasks
                </Typography>
                <Typography variant={isSmallScreen ? "caption" : "body2"} color="text.secondary" mb={2}>
                  Appointments awaiting your action
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {pending.length > 0 ? (
                  <Stack spacing={2}>
                    {pending.slice(0, 3).map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        sx={{
                          transition: 'transform 0.3s',
                          '&:hover': {
                            transform: 'scale(1.02)'
                          }
                        }}
                      />
                    ))}
                  </Stack>
                ) : (
                  <Box
                    textAlign="center"
                    py={4}
                    sx={{
                      background: `${theme.palette.success.light}10`,
                      borderRadius: 2
                    }}
                  >
                    <CheckCircle
                      size={isSmallScreen ? 40 : 48}
                      color={theme.palette.success.main}
                    />
                    <Typography variant={isSmallScreen ? "body1" : "subtitle1"} mt={1} color="success.main">
                      No pending tasks
                    </Typography>
                    <Typography variant={isSmallScreen ? "caption" : "body2"} color="text.secondary">
                      You're all caught up!
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Paper>
          </Grow>
        </Grid>

        {/* In Progress Tasks */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Grow in timeout={1000}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: 3,
                background: theme.palette.background.paper,
                height: '100%'
              }}
            >
              <CardContent>
                <Typography variant={isSmallScreen ? "h6" : "h5"} fontWeight="bold" mb={1}>
                  In Progress
                </Typography>
                <Typography variant={isSmallScreen ? "caption" : "body2"} color="text.secondary" mb={2}>
                  Currently working on
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {inProgress.length > 0 ? (
                  <Stack spacing={2}>
                    {inProgress.slice(0, 3).map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        sx={{
                          transition: 'transform 0.3s',
                          '&:hover': {
                            transform: 'scale(1.02)'
                          }
                        }}
                      />
                    ))}
                  </Stack>
                ) : (
                  <Box
                    textAlign="center"
                    py={4}
                    sx={{
                      background: `${theme.palette.warning.light}10`,
                      borderRadius: 2
                    }}
                  >
                    <Wrench
                      size={isSmallScreen ? 40 : 48}
                      color={theme.palette.warning.main}
                    />
                    <Typography variant={isSmallScreen ? "body1" : "subtitle1"} mt={1} color="warning.main">
                      No active tasks
                    </Typography>
                    <Typography variant={isSmallScreen ? "caption" : "body2"} color="text.secondary">
                      Ready for new assignments
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Paper>
          </Grow>
        </Grid>
      </Grid >

      {/* Recent Activity */}
      <Grow in timeout={1200}>
        <Paper
          elevation={3}
          sx={{
            borderRadius: 3,
            background: theme.palette.background.paper,
            p: isSmallScreen ? 2 : 3
          }}
        >
          <Typography variant={isSmallScreen ? "h6" : "h5"} fontWeight="bold" mb={2}>
            Recent Activity
          </Typography>
          <Divider sx={{ mb: 3 }} />
          {appointments.length > 0 ? (
            <Grid container spacing={isSmallScreen ? 1 : 3}>
              {appointments.slice(0, isSmallScreen ? 2 : 4).map((appointment) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={appointment.id}>
                  <AppointmentCard
                    appointment={appointment}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box
              textAlign="center"
              py={4}
              sx={{
                background: `${theme.palette.info.light}10`,
                borderRadius: 2
              }}
            >
              <User
                size={isSmallScreen ? 40 : 48}
                color={theme.palette.info.main}
              />
              <Typography variant={isSmallScreen ? "body1" : "subtitle1"} mt={1} color="info.main">
                No recent activity
              </Typography>
              <Typography variant={isSmallScreen ? "caption" : "body2"} color="text.secondary">
                Your completed work will appear here
              </Typography>
            </Box>
          )}
        </Paper>
      </Grow>
    </Box >
  );
};

export default MechanicDashboard;