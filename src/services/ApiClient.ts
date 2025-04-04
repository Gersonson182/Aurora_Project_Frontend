import axios from "axios";

const getToken = () => localStorage.getItem("access_token");

const apiClient = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/json",
    },
});

// ✅ Agregar el token a todas las solicitudes si existe
apiClient.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;






