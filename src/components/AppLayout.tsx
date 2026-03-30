import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/lib/store";
import AppHeader from "./AppHeader";

const AppLayout = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-surface">
      <AppHeader />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
