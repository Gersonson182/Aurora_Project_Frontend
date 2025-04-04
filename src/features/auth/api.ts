import apiClient from "../../services/ApiClient";

// Iniciar sesión (Login)
export const loginUser = async (rut: string, password: string) => {
  try {
      console.log("🔍 Enviando datos de login:", { rut, password });
      const response = await apiClient.post("/login/", { rut, password });

      console.log("✅ Respuesta del backend:", response.data); // 🔹 Muestra la respuesta del backend

      return response.data;
  } catch (error: any) {
      console.error("⚠ Error en loginUser:", error.response?.data || error);
      throw error.response?.data || "Error desconocido al iniciar sesión.";
  }
};

  



// ✅ Registrar usuario (Register)
export const registerUser = async (rut: string, email: string, password: string) => {
  return await apiClient.post("/register/", { rut, email, password }).then((res) => res.data);
};

// ✅ Cerrar sesión (Logout)
export const logoutUser = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  delete apiClient.defaults.headers.common["Authorization"];
};

// ✅ Obtener Token de Acceso
export const getAccessToken = () => {
  return localStorage.getItem("access_token");
};

