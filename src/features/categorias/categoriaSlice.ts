import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCategories, createCategory, updateCategory } from "./api";
import { Categoria } from "../../types";

interface CategoriaState {
  categories: Categoria[];
  loading: boolean;
  error: string | null;
}

// Estado inicial
const initialState: CategoriaState = {
  categories: [],
  loading: false,
  error: null,
};

// ✅ Thunk para obtener categorías
export const fetchCategoriesThunk = createAsyncThunk(
  "categoria/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchCategories();
    } catch (error) {
      return rejectWithValue("Error al cargar categorías");
    }
  }
);

// ✅ Thunk para crear una categoría
export const createCategoryThunk = createAsyncThunk(
  "categoria/createCategory",
  async (nombre: string, { rejectWithValue }) => {
    try {
      return await createCategory(nombre);
    } catch (error) {
      return rejectWithValue("Error al añadir categoría");
    }
  }
);

// ✅ Thunk para actualizar una categoría
export const updateCategoryThunk = createAsyncThunk(
  "categoria/updateCategory",
  async ({ id, nombre }: { id: number; nombre: string }, { rejectWithValue }) => {
    try {
      return await updateCategory(id, nombre);
    } catch (error) {
      return rejectWithValue("Error al actualizar categoría");
    }
  }
);

// ✅ Slice de Redux
const categoriaSlice = createSlice({
  name: "categoria",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoriesThunk.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(createCategoryThunk.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(updateCategoryThunk.fulfilled, (state, action) => {
        const index = state.categories.findIndex((cat) => cat.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      });
  },
});

export default categoriaSlice.reducer;

