import { Navigate, Outlet } from "react-router";
import { CircleNotchIcon } from "@phosphor-icons/react";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Wrap any route that requires authentication with this component.
 *
 * Why this lives here instead of in AuthProvider:
 * AuthProvider now renders children immediately, even while the initial
 * auth check is in flight. That's correct for public routes (landing page,
 * pricing, 404) which have nothing to wait for. Routes that DO require a
 * known auth state opt into that wait here, individually, so a slow
 * Firestore read doesn't blank out the entire app.
 */

export const ProtectedRoute = () => {
  const { currentUser, loading } = useAuth();
 
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-bg">
        <CircleNotchIcon
          size={28}
          className="animate-spin text-brand-neon-green"
          aria-label="Loading"
        />
      </div>
    );
  }
 
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
 
  // Outlet will automatically render whichever child route matches the URL
  return <Outlet />;
};