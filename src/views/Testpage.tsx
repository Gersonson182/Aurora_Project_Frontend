import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../stores/hooks";
import { logoutThunk } from "../features/auth/authSlice";
import ApiClient from "../services/ApiClient";
import { RootState } from "../stores/store";
import { useNavigate } from "react-router-dom";

const TestPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  // Datos de Redux
  const { user, isAuthenticated } = useAppSelector((state: RootState) => state.authSlice);
  const [serverResponse, setServerResponse] = useState<string>("Cargando...");
  const [token, setToken] = useState<string | null>(null);

  // Verifica el token en localStorage y prueba una API protegida
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    setToken(storedToken);

    const fetchUserData = async () => {
      try {
        const response = await ApiClient.get("/auth/user/");
        setServerResponse(JSON.stringify(response.data, null, 2));
      } catch (error: any) {
        setServerResponse("❌ Error al obtener datos del usuario. Verifica el backend.");
      }
    };

    if (storedToken) {
      fetchUserData();
    } else {
      setServerResponse("❌ No hay token guardado en localStorage.");
    }
  }, []);

  // Cerrar sesión
  const handleLogout = () => {
    dispatch(logoutThunk());
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">🔍 Test de Sesión</h1>

      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <h2 className="text-xl font-bold">🔐 Estado de Autenticación</h2>
        <p><strong>Autenticado:</strong> {isAuthenticated ? "✅ Sí" : "❌ No"}</p>
        <p><strong>Token en LocalStorage:</strong> {token ? "✅ Sí" : "❌ No"}</p>
        <p><strong>Usuario en Redux:</strong> {user ? JSON.stringify(user, null, 2) : "❌ No hay usuario en Redux"}</p>
      </div>

      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg mt-4">
        <h2 className="text-xl font-bold">🔎 Respuesta del Backend</h2>
        <pre className="bg-gray-200 p-4 rounded">{serverResponse}</pre>
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 bg-red-500 text-white py-2 px-4 rounded"
      >
        Cerrar Sesión
      </button>
    </div>
  );
};

export default TestPage;
