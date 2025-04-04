import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProviders, createProvider, updateProvider } from "./api";
import { Proveedor } from "../../types";

interface ProveedorState {
  providers: Proveedor[];
  loading: boolean;
  error: string | null;
}

// Estado inicial
const initialState: ProveedorState = {
  providers: [],
  loading: false,
  error: null,
};

// ✅ Thunk para obtener proveedores
export const fetchProvidersThunk = createAsyncThunk(
  "proveedor/fetchProviders",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchProviders();
    } catch (error) {
      return rejectWithValue("Error al cargar proveedores");
    }
  }
);

// ✅ Thunk para crear un proveedor
export const createProviderThunk = createAsyncThunk(
  "proveedor/createProvider",
  async ({ nombre, contacto }: { nombre: string; contacto: string }, { rejectWithValue }) => {
    try {
      return await createProvider(nombre, contacto);
    } catch (error) {
      return rejectWithValue("Error al añadir proveedor");
    }
  }
);

// ✅ Thunk para actualizar un proveedor
export const updateProviderThunk = createAsyncThunk(
  "proveedor/updateProvider",
  async ({ id, nombre, contacto }: { id: number; nombre: string; contacto: string }, { rejectWithValue }) => {
    try {
      return await updateProvider(id, nombre, contacto);
    } catch (error) {
      return rejectWithValue("Error al actualizar proveedor");
    }
  }
);

// ✅ Slice de Redux
const proveedorSlice = createSlice({
  name: "proveedor",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProvidersThunk.fulfilled, (state, action) => {
        state.providers = action.payload;
      })
      .addCase(createProviderThunk.fulfilled, (state, action) => {
        state.providers.push(action.payload);
      })
      .addCase(updateProviderThunk.fulfilled, (state, action) => {
        const index = state.providers.findIndex((prov) => prov.id === action.payload.id);
        if (index !== -1) {
          state.providers[index] = action.payload;
        }
      });
  },
});

export default proveedorSlice.reducer;
