import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./stores/store";

const PrivateRoute = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.authSlice?.isAuthenticated ?? false
  );

  console.log("🔍 Estado de autenticación en PrivateRoute:", isAuthenticated);

  // ✅ Asegurar que `isAuthenticated` haya sido inicializado antes de redirigir
  if (isAuthenticated === undefined) {
    return <div className="text-center p-10">🔄 Cargando...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;




