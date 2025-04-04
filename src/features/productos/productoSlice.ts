import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProducts, createProduct, updateProduct, deactivateProduct } from "./api";
import { ProductState } from "../../types";

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

// Obtener productos desde la API
export const fetchProductsThunk = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchProducts();
    } catch (error) {
      return rejectWithValue("Error al cargar productos");
    }
  }
);

// Crear un nuevo producto
export const createProductThunk = createAsyncThunk(
  "products/createProduct",
  async (productData: { nombre: string; precio_kilo: number }, { rejectWithValue }) => {
    try {
      return await createProduct(productData);
    } catch (error) {
      return rejectWithValue("Error al crear producto");
    }
  }
);

// Actualizar un producto
export const updateProductThunk = createAsyncThunk(
    "products/updateProduct",
    async ({ id, nombre, precio_kilo, categoria, proveedor }: 
      { id: number; nombre?: string; precio_kilo?: number; categoria?: number | null; proveedor?: number | null }, 
      { rejectWithValue }
    ) => {
      try {
        return await updateProduct(id, { nombre, precio_kilo, categoria, proveedor });
      } catch (error) {
        return rejectWithValue("Error al actualizar producto");
      }
    }
  );
  
  

// Desactivar un producto (cambiar `activo` a `false` en la BD)
export const deactivateProductThunk = createAsyncThunk(
  "products/deactivateProduct",
  async (id: number, { rejectWithValue }) => {
    try {
      return await deactivateProduct(id);
    } catch (error) {
      return rejectWithValue("Error al desactivar producto");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(createProductThunk.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        const index = state.products.findIndex((product) => product.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(deactivateProductThunk.fulfilled, (state, action) => {
        const index = state.products.findIndex((product) => product.id === action.payload.id);
        if (index !== -1) {
          state.products[index].activo = false;
        }
      });
  },
});

export default productSlice.reducer;
