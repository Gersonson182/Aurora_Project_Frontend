import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./Layout/Layout";
import { useEffect } from "react";
import { useAppDispatch } from "./stores/hooks";
import { logoutThunk } from "./features/auth/authSlice";
import InsumoPage from "./views/InsumoPage";
import HistoricoPage from "./views/HistoricoPage";
import CategoriaList from "./features/categorias/CategoriaList";
import ProveedorList from "./features/proveedores/ProvedoorList";
import EditarProduct from "./features/productos/EditarProduct";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import TestPage from "./views/Testpage"; // ✅ Integrado el TestPage
import PrivateRoute from "./PrivateRouter"; // ✅ Rutas protegidas


const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 minutos

function AppRouter() {

  const dispatch = useAppDispatch();

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        console.log("⏳ Usuario inactivo, cerrando sesión...");
        dispatch(logoutThunk()); // Cierra sesión automáticamente
      }, INACTIVITY_LIMIT);
    };

    // ✅ Detectar actividad del usuario y reiniciar el timer
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);
    resetTimer(); // ✅ Inicializar timer al montar

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* ✅ Rutas de autenticación (Públicas) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ Rutas protegidas */}
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            {/* 🔹 Redirige a recetas por defecto */}
            <Route index element={<Navigate to="/insumos/dieta" replace />} />
            <Route path="insumos/dieta" element={<InsumoPage />} />
            <Route path="insumos/productos" element={<InsumoPage />} />
            <Route path="historico/dieta" element={<HistoricoPage />} />
            <Route path="historico/producto" element={<HistoricoPage />} />
            <Route path="insumos/productos/editar/:id" element={<EditarProduct />} />
            <Route path="categorias" element={<CategoriaList />} />
            <Route path="proveedores" element={<ProveedorList />} />
            <Route path="test" element={<TestPage />} /> {/* ✅ Integración de TestPage */}
          </Route>
        </Route>

        {/* ✅ Redirigir cualquier otra ruta a Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;






