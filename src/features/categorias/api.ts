import apiClient from "../../services/ApiClient";
import { Categoria } from "../../types";

//  Obtener todas las categorías
export const fetchCategories = async (): Promise<Categoria[]> => {
  const response = await apiClient.get("/categorias/");
  return response.data;
};

//  Crear una nueva categoría
export const createCategory = async (nombre: string): Promise<Categoria> => {
  const response = await apiClient.post("/categorias/", { nombre });
  return response.data;
};

//  Actualizar una categoría
export const updateCategory = async (id: number, nombre: string): Promise<Categoria> => {
  const response = await apiClient.put(`/categorias/${id}/`, { nombre });
  return response.data;
};

