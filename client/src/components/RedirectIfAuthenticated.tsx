import { Navigate, Outlet } from "react-router";
import { CircleNotchIcon } from "@phosphor-icons/react";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Wrap /login and /register with this. If someone is already authenticated
 * and navigates (or hits back) to one of those routes, send them to the
 * dashboard instead of showing them a form they don't need.
 *
 * Mirrors ProtectedRoute's logic in reverse — kept as a separate component
 * rather than a prop flag on ProtectedRoute so each one reads clearly at
 * the call site in App.tsx.
 */
export const RedirectIfAuthenticated = () => {
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

  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};