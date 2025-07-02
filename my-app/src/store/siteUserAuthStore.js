import { create } from "zustand";
import axios from "axios";

// You may need to adjust API_URL for your environment
const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/siteuser"
    : "/api/siteuser";

export const useSiteUserAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem("siteuser_token") || null,
  isAuthenticated: !!localStorage.getItem("siteuser_token"),
  isLoading: false,
  error: null,

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/signup`, { email, password, name });
      set({ isLoading: false }); // Wait for verification
    } catch (error) {
      set({
        error:
          error.response?.data?.message || error.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  verifyEmail: async (email, code) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/verify-email`, { email, code });
      set({
        user: res.data.user,
        token: res.data.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      localStorage.setItem("siteuser_token", res.data.token);
      return res.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Verification failed",
        isLoading: false,
      });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      set({
        user: res.data.user,
        token: res.data.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      localStorage.setItem("siteuser_token", res.data.token);
      return res.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Login failed",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: () => {
    set({ user: null, token: null, isAuthenticated: false });
    localStorage.removeItem("siteuser_token");
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/forgot-password`, { email });
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error sending reset email",
        isLoading: false,
      });
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/reset-password/${token}`, { password });
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error resetting password",
        isLoading: false,
      });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isLoading: true, error: null });
    const token = get().token;
    if (!token) {
      set({ isAuthenticated: false, user: null, isLoading: false });
      return;
    }
    try {
      const res = await axios.get(`${API_URL}/check-auth`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({
        user: res.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
      localStorage.removeItem("siteuser_token");
    }
  },

changePassword: async (currentPassword, newPassword) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await axios.post(`${API_URL}/change-password`, {
        currentPassword,
        newPassword,
      });
      set({
        isLoading: false,
        error: null,
        message: response.data.message,
      });
      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Error changing password",
      });
      throw error;
    }
  },

  updateProfile: async (name, email) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await axios.post(`${API_URL}/update-profile`, {
        name,
        email,
      });
      set({
        user: response.data.user,
        isLoading: false,
        error: null,
        message: response.data.message,
      });
      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Error updating profile",
      });
      throw error;
    }
  },
}));








