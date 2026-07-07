import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import GuestRoute from "../components/GuestRoute/GuestRoute";

const AdminLogin = lazy(() => import("../pages/Login/Login"));
const AdminLayout = lazy(() => import("../layouts/AdminLayout/AdminLayout"));
const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard"));
const Products = lazy(() => import("../pages/Products/Products"));
const AddProduct = lazy(() => import("../pages/Products/AddProduct"));
const EditProduct = lazy(() => import("../pages/Products/EditProduct"));
const Categories = lazy(() => import("../pages/Categories/Categories"));
const Subcategories = lazy(() => import("../pages/Subcategories/Subcategories"));
const Orders = lazy(() => import("../pages/Orders/Orders"));
const AdminPage = lazy(() => import("../pages/AdminPage/AdminPage"));

const AdminRoutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route
          path="login"
          element={
            <GuestRoute>
              <AdminLogin />
            </GuestRoute>
          }
        />

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/edit/:id" element={<EditProduct />} />
            <Route path="categories" element={<Categories />} />
            <Route path="subcategories" element={<Subcategories />} />
            <Route path="orders" element={<Orders />} />
            <Route
              path="settings"
              element={
                <AdminPage
                  title="Settings"
                  description="Store settings coming soon."
                />
              }
            />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="login" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AdminRoutes;
