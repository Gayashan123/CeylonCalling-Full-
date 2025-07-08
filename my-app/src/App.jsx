import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useAuthStore } from "./shopowner/store/authStore";
import { useSiteUserAuthStore } from "./store/siteUserAuthStore";

// Common Components
import Header from "./components/Header";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

import FoodList from "./pages/FoodList";

// Shopowner Pages
import Shop from "./shopowner/pages/ShopOwner";
import MyShop from "./shopowner/pages/MyShop";
import Settings from "./shopowner/pages/Settings";
import ShopForm from "./shopowner/pages/ShopLogUi";
import ShopCreate from "./shopowner/pages/ShopCreateAcc";
import DashboardPage from "./shopowner/pages/ShopOwner";
import ShopOwnerSignUpPage from "./shopowner/pages/SignUpPage";
import ShopOwnerLoginPage from "./shopowner/pages/LoginPage";
import ShopOwnerEmailVerificationPage from "./shopowner/pages/EmailVerificationPage";
import ShopOwnerForgotPasswordPage from "./shopowner/pages/ForgotPasswordPage";
import ShopOwnerResetPasswordPage from "./shopowner/pages/ResetPasswordPage";

// Site User Pages
import UserLogUi from "./pages/UserLogUi";
import UserDashboard from "./pages/Home";
import UserProfile from "./pages/Addplace"
import SiteUserSignUpPage from "./pages/SignUpPage";
import SiteUserLoginPage from "./pages/LoginPage";
import SiteUserEmailVerificationPage from "./pages/UserEmailVerificationPage";
import SiteUserForgotPasswordPage from "./pages/UserForgotPasswordPage";
import SiteUserResetPasswordPage from "./pages/UserResetPasswordPage";
import UserSettings from "./pages/UserSettings";
 
// Components
import LoadingSpinner from "./shopowner/components/LoadingSpinner";

// ----------- Route Protection Logic ----------- //

// Shopowner protected route
const ShopOwnerProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const user = useAuthStore(state => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!user?.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  return children;
};

// Shopowner redirect if auth
const ShopOwnerRedirectAuthenticatedUser = ({ children }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const user = useAuthStore(state => state.user);

  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

// Site user protected route
const SiteUserProtectedRoute = ({ children }) => {
  const isAuthenticated = useSiteUserAuthStore(state => state.isAuthenticated);
  const user = useSiteUserAuthStore(state => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/user/login" replace />;
  }
  if (!user?.isVerified) {
    return <Navigate to="/user/verify-email" replace />;
  }
  return children;
};

// Site user redirect if auth
const SiteUserRedirectAuthenticatedUser = ({ children }) => {
  const isAuthenticated = useSiteUserAuthStore(state => state.isAuthenticated);
  const user = useSiteUserAuthStore(state => state.user);

  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/user/dashboard" replace />;
  }
  return children;
};

function App() {
  // Shopowner auth check
  const isCheckingAuth = useAuthStore(state => state.isCheckingAuth);
  const checkShopOwnerAuth = useAuthStore(state => state.checkAuth);

  // Site user auth check
  const isLoading = useSiteUserAuthStore(state => state.isLoading);
  const checkSiteUserAuth = useSiteUserAuthStore(state => state.checkAuth);

  useEffect(() => {
    checkShopOwnerAuth();
    checkSiteUserAuth();
    // eslint-disable-next-line
  }, []);

  if (isCheckingAuth || isLoading) return <LoadingSpinner />;

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

        {/* Landing Home */}
       

        {/* Food listing (public) */}
        <Route path="/foodpage/:shopId" element={<FoodList />} />

        {/* ----------- SHOPOWNER ROUTES ----------- */}
        <Route path="/shop" element={<Shop />} />
        <Route path="/myshop" element={<MyShop />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/shopform" element={<ShopForm />} />

        {/* Shopowner Auth */}
        <Route
          path="/signup"
          element={
            <ShopOwnerRedirectAuthenticatedUser>
              <ShopOwnerSignUpPage />
            </ShopOwnerRedirectAuthenticatedUser>
          }
        />
        <Route
          path="/login"
          element={
            <ShopOwnerRedirectAuthenticatedUser>
              <ShopOwnerLoginPage />
            </ShopOwnerRedirectAuthenticatedUser>
          }
        />
        <Route path="/verify-email" element={<ShopOwnerEmailVerificationPage />} />
        <Route
          path="/forgot-password"
          element={
            <ShopOwnerRedirectAuthenticatedUser>
              <ShopOwnerForgotPasswordPage />
            </ShopOwnerRedirectAuthenticatedUser>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <ShopOwnerRedirectAuthenticatedUser>
              <ShopOwnerResetPasswordPage />
            </ShopOwnerRedirectAuthenticatedUser>
          }
        />

        {/* Shopowner Protected */}
        <Route
          path="/dashboard"
          element={
            <ShopOwnerProtectedRoute>
              <DashboardPage />
            </ShopOwnerProtectedRoute>
          }
        />
        <Route
          path="/shopcreate"
          element={
            <ShopOwnerProtectedRoute>
              <ShopCreate />
            </ShopOwnerProtectedRoute>
          }
        />

        {/* ----------- SITE USER ROUTES ----------- */}
        <Route path="/userlogui" element={<UserLogUi />} />
              


        {/* SiteUser Auth */}
        <Route
          path="/user/signup"
          element={
            <SiteUserRedirectAuthenticatedUser>
              <SiteUserSignUpPage />
            </SiteUserRedirectAuthenticatedUser>
          }
        />
        <Route
          path="/user/login"
          element={
            <SiteUserRedirectAuthenticatedUser>
              <SiteUserLoginPage />
            </SiteUserRedirectAuthenticatedUser>
          }
        />
        <Route path="/verify-email1" element={<SiteUserEmailVerificationPage />} />
        <Route
          path="/user/forgot-password"
          element={
            <SiteUserRedirectAuthenticatedUser>
              <SiteUserForgotPasswordPage />
            </SiteUserRedirectAuthenticatedUser>
          }
        />
        <Route
          path="/user/reset-password/:token"
          element={
            <SiteUserRedirectAuthenticatedUser>
              <SiteUserResetPasswordPage />
            </SiteUserRedirectAuthenticatedUser>
          }
        />

        {/* SiteUser Protected */}
        <Route
          path="/user/dashboard"
          element={
            <SiteUserProtectedRoute>
              <UserDashboard />
            </SiteUserProtectedRoute>
          }
        />

        <Route
  path="/usersetting"
  element={
    <SiteUserProtectedRoute>
      <UserSettings />
    </SiteUserProtectedRoute>
  }
/>

       


        <Route
          path="/user/profile"
          element={
            <SiteUserProtectedRoute>
              <UserProfile />
            </SiteUserProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;