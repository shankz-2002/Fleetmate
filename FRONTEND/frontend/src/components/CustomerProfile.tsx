import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import {
  getCustomerProfile,
  createCustomerProfile,
  updateCustomerProfile,
  deleteCustomerProfile,
} from "../services/allApis";
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";

interface CustomerProfileData {
  phone: string;
  address: string;
  profileImage: string;
}

const CustomerProfile: React.FC = () => {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState<CustomerProfileData | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [form, setForm] = useState<CustomerProfileData>({
    phone: "",
    address: "",
    profileImage: "",
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (user && token) {
        try {
          const res = await getCustomerProfile();
          const data = res.data?.found || res.data;
          if (data) {
            setProfile(data);
            setForm({
              phone: data.phone || "",
              address: data.address || "",
              profileImage: data.profileImage || "",
            });
          }
        } catch (err) {
          console.warn("No profile found or error fetching profile");
        }
      }
    };
    fetchProfile();
  }, [user, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (profile) {
        await updateCustomerProfile(form);
      } else {
        await createCustomerProfile(form);
      }

      const refreshed = await getCustomerProfile();
      const updatedData = refreshed.data?.found || refreshed.data;

      setProfile(updatedData);
      setForm({
        phone: updatedData.phone,
        address: updatedData.address,
        profileImage: updatedData.profileImage,
      });
      setEditMode(false);
      setSnackbar({
        open: true,
        message: "Profile saved successfully!",
        severity: "success",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to save profile",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setConfirmDelete(false);
    setLoading(true);
    try {
      await deleteCustomerProfile();
      setProfile(null);
      setForm({ phone: "", address: "", profileImage: "" });
      setEditMode(false);
      setSnackbar({
        open: true,
        message: "Profile deleted successfully.",
        severity: "success",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to delete profile",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box mt={4} display="flex" justifyContent="center">
      <Paper sx={{ p: 4, width: "100%", maxWidth: 600 }}>
        <Typography variant="h5" gutterBottom>
          {profile ? "Your Profile" : "Create Your Profile"}
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid size={{xs:12}} textAlign="center">
            <Avatar
              alt="Profile Image"
              src={form.profileImage}
              sx={{ width: 80, height: 80, margin: "auto" }}
            />
          </Grid>

          {["phone", "address", "profileImage"].map((field) => (
            <Grid size={{xs:12}} key={field}>
              <TextField
                fullWidth
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                name={field}
                value={form[field as keyof CustomerProfileData] ?? ""}
                onChange={handleChange}
                disabled={!!profile && !editMode}
              />
            </Grid>
          ))}
        </Grid>

        <Box mt={3} display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
          {profile && !editMode && (
            <Button variant="outlined" onClick={() => setEditMode(true)}>
              Edit
            </Button>
          )}

          {(editMode || !profile) && (
            <Button
              variant="contained"
              onClick={handleSubmit}
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : profile ? "Update" : "Create Profile"}
            </Button>
          )}

          {profile && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => setConfirmDelete(true)}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Delete Profile"}
            </Button>
          )}
        </Box>

        <ConfirmDeleteDialog
          open={confirmDelete}
          onClose={() => setConfirmDelete(false)}
          onConfirm={handleDelete}
          loading={loading}
          title="Delete Your Profile"
          message="Are you sure you want to delete your profile? This action cannot be undone."
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default CustomerProfile;
