import apiClient from "../../services/ApiClient";
import { Proveedor } from "../../types";

// 🟢 Obtener todos los proveedores
export const fetchProviders = async (): Promise<Proveedor[]> => {
  const response = await apiClient.get("/proveedores/");
  return response.data;
};

// 🟢 Crear un nuevo proveedor
export const createProvider = async (nombre: string, contacto: string): Promise<Proveedor> => {
  const response = await apiClient.post("/proveedores/", { nombre, contacto });
  return response.data;
};

// 🟢 Actualizar un proveedor
export const updateProvider = async (id: number, nombre: string, contacto: string): Promise<Proveedor> => {
  const response = await apiClient.put(`/proveedores/${id}/`, { nombre, contacto });
  return response.data;
};

