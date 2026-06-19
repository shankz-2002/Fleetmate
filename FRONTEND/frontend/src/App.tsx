import { Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import MechanicDashboard from "./pages/Dashboard/MechanicDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import theme from "./theme";
import { AuthProvider } from "./context/AuthContext";
import CustomerProfile from "./components/CustomerProfile";
import MechanicProfile from "./components/MechanicProfile";
import Vehicles from "./pages/Vehicles";
import { ManagerDashboard } from "./pages/Dashboard/ManagerDashboard";
import MechanicsPage from "./pages/MechanicsPage";
import AppointmentsPageCustomer from "./pages/AppointmentCustomer";
import MechanicTask from "./pages/MechanicTask";
import CustomerBill from "./pages/CustomerBill";
import { CustomerDashboard } from "./pages/Dashboard/CustomerDashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import AdminCustomer from "./pages/AdminCustomer";
import AdminManager from "./pages/AdminManager";
import AdminMechanic from "./pages/AdminMechanic";
import AppointmentManager from "./pages/AppointmentManager";
import AdminVehicle from "./pages/AdminVehicle";
import AdminBill from "./pages/AdminBill";
import ManagerBill from "./pages/ManagerBill";
import AnalyticsDashboard from "./pages/Dashboard/AnalyticsDashboard";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          {/* Public Routes */}
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} /> 


          {/* Protected Customer Route */}
          <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/customer-dashboard" element={<CustomerDashboard />} />
              <Route path="/customer-profile" element={<CustomerProfile />} />
              <Route path="/vehicles" element={< Vehicles />} />
              <Route path="/customer/appointments" element={< AppointmentsPageCustomer />} />
              <Route path="/customer-bills" element={< CustomerBill />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin-users" element={<AdminCustomer />} />
              <Route path="/admin-managers" element={<AdminManager />} />
              <Route path="/admin-mechanics" element={<AdminMechanic />} />
              <Route path="/admin-vehicles" element={<AdminVehicle />} />
              <Route path="/admin-bills" element={<AdminBill />} />




              {/* <Route path="/admin/appointments" element={<AppointmentManager />} /> */}


            </Route>
          </Route>



          {/* Protected Mechanic Route */}
          <Route element={<ProtectedRoute allowedRoles={['mechanic']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/mechanic-dashboard" element={<MechanicDashboard />} />
              <Route path="/mechanic-profile" element={<MechanicProfile />} />
              <Route path="/tasks" element={<MechanicTask />} />


            </Route>
          </Route>


          <Route element={<ProtectedRoute allowedRoles={['admin', 'manager']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/appointments" element={<AppointmentManager />} />
              <Route path="/analytics" element={<AnalyticsDashboard />} />

            </Route>
          </Route>




          {/* Protected Manager Route */}







          <Route element={<ProtectedRoute allowedRoles={['manager']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/manager-dashboard" element={<ManagerDashboard />} />


              {/* <Route path="/manager/appointments" element={< AppointmentManager />} /> */}

              <Route path="/mechanics" element={< MechanicsPage />} />
              <Route path="/manager-bills" element={< ManagerBill />} />





            </Route>
          </Route>
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
