import { useUser } from "@supabase/auth-helpers-react";
import { Navigate, Outlet } from "react-router-dom";
import { useState } from "react";
import AuthModal from "./AuthModal";

const ProtectedRoute = () => {
  const user = useUser();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(!user);

  if (!user) {
    // Show the modal to prompt login.
    // The modal will handle closing itself, but we need to render it.
    // We also render a Navigate component to prevent the protected content from flashing.
    // Or, we could render a loading spinner or a blank page.
    return (
      <>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        {/* Optionally, redirect them to home while the modal is open */}
        <Navigate to="/" replace />
      </>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;