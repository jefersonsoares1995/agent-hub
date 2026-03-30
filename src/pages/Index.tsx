import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/lib/store";

const Index = () => {
  const { isAuthenticated } = useAuthStore();
  return <Navigate to={isAuthenticated ? "/agentes" : "/login"} replace />;
};

export default Index;
