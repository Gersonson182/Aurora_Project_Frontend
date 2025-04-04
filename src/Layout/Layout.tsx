import { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { Outlet, Navigate } from "react-router-dom";
import { getAccessToken } from "../features/auth/api";
import { jwtDecode } from "jwt-decode";
import { useAppSelector, useAppDispatch } from "../stores/hooks";
import { logoutThunk } from "../features/auth/authSlice";

export const Layout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const user = useAppSelector((state) => state.authSlice.user); // ✅ Obtenemos usuario desde Redux
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkAuth = () => {
      const token = getAccessToken();

      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const decodedToken: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          console.warn("🔴 Token expirado. Cerrando sesión.");
          dispatch(logoutThunk());
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("⚠️ Error al decodificar el token:", error);
        dispatch(logoutThunk());
        setIsAuthenticated(false);
      }
    };

    if (isAuthenticated === null) {
      checkAuth();
    }
  }, [isAuthenticated, dispatch]);

  if (isAuthenticated === null) {
    return <div className="text-center p-10">🔄 Verificando autenticación...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header user={user} /> {/* ✅ Pasamos `user` como prop */}
        <main className="p-6 bg-gray-100 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};









