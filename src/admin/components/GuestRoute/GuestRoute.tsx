import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import Loader from "../../../components/Loader/Loader";

interface GuestRouteProps {
  children: React.ReactNode;
}

const GuestRoute = ({ children }: GuestRouteProps) => {
  const { isAdmin, loading } = useAdminAuth();

  if (loading) return <Loader />;

  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default GuestRoute;
