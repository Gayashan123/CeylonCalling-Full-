import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./shopowner/store/authStore";
import { useEffect } from "react";

import Header from "./components/Header";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Shop from "./shopowner/pages/ShopOwner";
import MyShop from "./shopowner/pages/MyShop";
import Settings from "./shopowner/pages/Settings";
import ShopForm from "./shopowner/pages/ShopLogUi";
import FoodList from "./pages/FoodList"


import SignUpPage from "./shopowner/pages/SignUpPage";
import LoginPage from "./shopowner/pages/LoginPage";
import EmailVerificationPage from "./shopowner/pages/EmailVerificationPage";
import DashboardPage from "./shopowner/pages/ShopOwner";
import ForgotPasswordPage from "./shopowner/pages/ForgotPasswordPage";
import ResetPasswordPage from "./shopowner/pages/ResetPasswordPage";
import ShopCreate from "./shopowner/pages/ShopCreateAcc";

import FloatingShape from "./shopowner/components/FloatingShape";
import LoadingSpinner from "./shopowner/components/LoadingSpinner";

// Protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const user = useAuthStore(state => state.user);

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  if (!user?.isVerified) {
    return <Navigate to='/verify-email' replace />;
  }

  return children;
};

// Redirect authenticated users to dashboard
const RedirectAuthenticatedUser = ({ children }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const user = useAuthStore(state => state.user);

  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  const isCheckingAuth = useAuthStore(state => state.isCheckingAuth);
  const checkAuth = useAuthStore(state => state.checkAuth);

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line
  }, []);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <Router>
      <Toaster />
      <Routes>
        {/* Public Website */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <About />
              <Contact />
              <Footer />
            </>
          }
        />

        {/* Landing Page with Login / Signup Buttons */}
        <Route path="/home" element={<Home />} />

        {/* Shop/Owner Pages */}
        <Route path="/shop" element={<Shop />} />
        <Route path="/myshop" element={<MyShop />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/shopform" element={<ShopForm />} />
        <Route path="/foodpage/:shopId" element={<FoodList />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Shop Creation */}
        <Route
          path="/shopcreate"
          element={
            <ProtectedRoute>
              <ShopCreate />
            </ProtectedRoute>
          }
        />

        {/* Auth routes */}
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <SignUpPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route
          path="/forgot-password"
          element={
            <RedirectAuthenticatedUser>
              <ForgotPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <RedirectAuthenticatedUser>
              <ResetPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;