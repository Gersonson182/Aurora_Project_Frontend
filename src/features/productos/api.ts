import apiClient from "../../services/ApiClient";
import { Product } from "../../types";

// 🟢 Obtener todos los productos
export const fetchProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get("/productos/");
  return response.data;
};

// 🟢 Crear un nuevo producto
export const createProduct = async (
  productoData: { nombre: string; precio_kilo: number; categoria?: number | null; proveedor?: number | null }
): Promise<Product> => {
  const response = await apiClient.post("/productos/", productoData);
  return response.data;
};

// ✅ Actualizar un producto
export const updateProduct = async (
    id: number,
    productoData: { nombre?: string; precio_kilo?: number; categoria?: number | null; proveedor?: number | null }
  ): Promise<Product> => {
    const response = await apiClient.patch(`/productos/${id}/`, productoData);
    return response.data;
  };
  

// 🔴 **Nueva función para desactivar un producto**
export const deactivateProduct = async (id: number): Promise<Product> => {
  const response = await apiClient.patch(`/productos/${id}/desactivar/`, { activo: false });
  return response.data;
};



