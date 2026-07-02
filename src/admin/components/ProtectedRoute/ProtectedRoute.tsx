import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import Loader from "../../../components/Loader/Loader";

const ProtectedRoute = () => {
  const { isAdmin, loading } = useAdminAuth();

  if (loading) return <Loader />;

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
