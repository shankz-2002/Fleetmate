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
  CircularProgress
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import {
  getMechanicProfile,
  createMechanicProfile,
  updateMechanicProfile,
  deleteMechanicProfile
} from "../services/allApis";
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";

interface MechanicProfileData {
  phone: string;
  address: string;
  profileImage: string;
  skills: string;
  yearsOfExperience: string;
}

const MechanicProfile: React.FC = () => {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState<MechanicProfileData | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<MechanicProfileData>({
    phone: "",
    address: "",
    profileImage: "",
    skills: "",
    yearsOfExperience: "",
  });
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (user && token) {
        try {
          const res = await getMechanicProfile();
          const data = res.data?.found || res.data;

          if (data) {
            setProfile(data);
            setForm({
              phone: data.phone || "",
              address: data.address || "",
              profileImage: data.profileImage || "",
              skills: (data.skills || []).join(", "),
              yearsOfExperience: String(data.yearsOfExperience || ""),
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
      const payload = {
        ...form,
        skills: form.skills.split(",").map((s) => s.trim()),
        yearsOfExperience: Number(form.yearsOfExperience),
      };

      if (profile) {
        await updateMechanicProfile(payload);
      } else {
        await createMechanicProfile(payload);
      }

      const refreshed = await getMechanicProfile();
      const updatedData = refreshed.data?.found || refreshed.data;

      setProfile(updatedData);
      setForm({
        phone: updatedData.phone,
        address: updatedData.address,
        profileImage: updatedData.profileImage,
        skills: (updatedData.skills || []).join(", "),
        yearsOfExperience: String(updatedData.yearsOfExperience || ""),
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
      await deleteMechanicProfile();
      setProfile(null);
      setForm({
        phone: "",
        address: "",
        profileImage: "",
        skills: "",
        yearsOfExperience: "",
      });
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
          {profile ? "Your Mechanic Profile" : "Create Mechanic Profile"}
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12 }} textAlign="center">
            <Avatar
              alt="Profile Image"
              src={form.profileImage}
              sx={{ width: 80, height: 80, margin: "auto" }}
            />
          </Grid>

          {["phone", "address", "profileImage", "skills", "yearsOfExperience"].map((field) => (
            <Grid size={{ xs: 12 }} key={field}>
              <TextField
                fullWidth
                label={field
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
                name={field}
                value={form[field as keyof MechanicProfileData] ?? ""}
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

export default MechanicProfile;
