import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/siteuser"
    : "/api/siteuser";
const FAV_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/user/favourites"
    : "/api/user/favourites";

export const useSiteUserAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem("siteuser_token") || null,
  isAuthenticated: !!localStorage.getItem("siteuser_token"),
  loading: {
    auth: false,
    favourites: false,
  },
  error: null,
  message: null,
  favourites: [],
  favouriteIds: new Set(),

  // --- Auth Actions ---

  signup: async (email, password, name) => {
    set((state) => ({ loading: { ...state.loading, auth: true }, error: null }));
    try {
      await axios.post(`${API_URL}/signup`, { email, password, name });
      set((state) => ({ loading: { ...state.loading, auth: false } }));
      toast.success("Sign up successful! Please check your email to verify.");
    } catch (error) {
      set((state) => ({
        error: error.response?.data?.message || error.message || "Error signing up",
        loading: { ...state.loading, auth: false },
      }));
      toast.error(error.response?.data?.message || "Sign up failed.");
      throw error;
    }
  },

  verifyEmail: async (email, code) => {
    set((state) => ({ loading: { ...state.loading, auth: true }, error: null }));
    try {
      const res = await axios.post(`${API_URL}/verify-email`, { email, code });
      set((state) => ({
        user: res.data.user,
        token: res.data.token,
        isAuthenticated: true,
        loading: { ...state.loading, auth: false },
        error: null,
      }));
      localStorage.setItem("siteuser_token", res.data.token);
      toast.success("Email verified!");
      return res.data;
    } catch (error) {
      set((state) => ({
        error: error.response?.data?.message || "Verification failed",
        loading: { ...state.loading, auth: false },
      }));
      toast.error(error.response?.data?.message || "Verification failed");
      throw error;
    }
  },

  login: async (email, password) => {
    set((state) => ({ loading: { ...state.loading, auth: true }, error: null }));
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      set((state) => ({
        user: res.data.user,
        token: res.data.token,
        isAuthenticated: true,
        loading: { ...state.loading, auth: false },
        error: null,
      }));
      localStorage.setItem("siteuser_token", res.data.token);
      toast.success("Login successful!");
      return res.data;
    } catch (error) {
      set((state) => ({
        error: error.response?.data?.message || "Login failed",
        loading: { ...state.loading, auth: false },
      }));
      toast.error(error.response?.data?.message || "Login failed");
      throw error;
    }
  },

  logout: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      favourites: [],
      favouriteIds: new Set(),
    });
    localStorage.removeItem("siteuser_token");
    toast.success("Logged out successfully.");
  },

  forgotPassword: async (email) => {
    set((state) => ({ loading: { ...state.loading, auth: true }, error: null }));
    try {
      await axios.post(`${API_URL}/forgot-password`, { email });
      set((state) => ({ loading: { ...state.loading, auth: false } }));
      toast.success("Password reset email sent!");
    } catch (error) {
      set((state) => ({
        error: error.response?.data?.message || "Error sending reset email",
        loading: { ...state.loading, auth: false },
      }));
      toast.error(error.response?.data?.message || "Error sending reset email");
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set((state) => ({ loading: { ...state.loading, auth: true }, error: null }));
    try {
      await axios.post(`${API_URL}/reset-password/${token}`, { password });
      set((state) => ({ loading: { ...state.loading, auth: false } }));
      toast.success("Password reset successful!");
    } catch (error) {
      set((state) => ({
        error: error.response?.data?.message || "Error resetting password",
        loading: { ...state.loading, auth: false },
      }));
      toast.error(error.response?.data?.message || "Error resetting password");
      throw error;
    }
  },

  checkAuth: async () => {
    set((state) => ({ loading: { ...state.loading, auth: true }, error: null }));
    const token = get().token;
    if (!token) {
      set({ isAuthenticated: false, user: null, loading: { ...get().loading, auth: false } });
      return;
    }
    try {
      const res = await axios.get(`${API_URL}/check-auth`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        user: res.data.user,
        isAuthenticated: true,
        loading: { ...state.loading, auth: false },
      }));
    } catch (error) {
      set((state) => ({
        isAuthenticated: false,
        user: null,
        loading: { ...state.loading, auth: false },
      }));
      localStorage.removeItem("siteuser_token");
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    set((state) => ({ loading: { ...state.loading, auth: true }, error: null, message: null }));
    const token = get().token;
    try {
      const response = await axios.post(
        `${API_URL}/change-password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set((state) => ({
        loading: { ...state.loading, auth: false },
        error: null,
        message: response.data.message,
      }));
      toast.success("Password changed!");
      return response.data;
    } catch (error) {
      set((state) => ({
        loading: { ...state.loading, auth: false },
        error: error.response?.data?.message || error.message || "Error changing password",
      }));
      toast.error(error.response?.data?.message || "Error changing password");
      throw error;
    }
  },

  updateProfile: async (name, email) => {
    set((state) => ({ loading: { ...state.loading, auth: true }, error: null, message: null }));
    const token = get().token;
    try {
      const response = await axios.post(
        `${API_URL}/update-profile`,
        { name, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set((state) => ({
        user: response.data.user,
        loading: { ...state.loading, auth: false },
        error: null,
        message: response.data.message,
      }));
      toast.success("Profile updated!");
      return response.data;
    } catch (error) {
      set((state) => ({
        loading: { ...state.loading, auth: false },
        error: error.response?.data?.message || error.message || "Error updating profile",
      }));
      toast.error(error.response?.data?.message || "Error updating profile");
      throw error;
    }
  },

  // --- Favourites ---

  fetchFavourites: async () => {
    set((state) => ({
      loading: { ...state.loading, favourites: true },
    }));
    try {
      const token = get().token;
      const res = await fetch(FAV_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      set({
        favourites: Array.isArray(data) ? data : [],
        favouriteIds: new Set(Array.isArray(data) ? data.map((s) => s._id) : []),
        loading: { ...get().loading, favourites: false },
      });
    } catch {
      set({
        favourites: [],
        favouriteIds: new Set(),
        loading: { ...get().loading, favourites: false },
      });
    }
  },

  addFavourite: async (shopId) => {
    const token = get().token;
    set((state) => ({
      loading: { ...state.loading, favourites: true },
    }));
    try {
      await fetch(FAV_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ shopId }),
      });
      await get().fetchFavourites();
    } catch {
      // Optionally handle error
    } finally {
      set((state) => ({
        loading: { ...state.loading, favourites: false },
      }));
    }
  },

  removeFavourite: async (shopId) => {
    const token = get().token;
    set((state) => ({
      loading: { ...state.loading, favourites: true },
    }));
    try {
      await fetch(`${FAV_URL}/${shopId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await get().fetchFavourites();
    } catch {
      // Optionally handle error
    } finally {
      set((state) => ({
        loading: { ...state.loading, favourites: false },
      }));
    }
  },
}));