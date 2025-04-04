import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, logoutUser, registerUser } from "./api";

const initialState: {
    user: any | null;
    isAuthenticated: boolean;
    token: string | null;
    loading: boolean;
    error: string | null;  // Asegurar que `error` pueda ser `string` o `null`
  } = {
    user: JSON.parse(localStorage.getItem("user") || "null"),
    isAuthenticated: !!localStorage.getItem("access_token"),
    token: localStorage.getItem("access_token") || null,
    loading: false,
    error: null,  //
  };

// ✅ Thunk para iniciar sesión
export const loginThunk = createAsyncThunk(
  "auth/login",
  async ({ rut, password }: { rut: string; password: string }, { rejectWithValue }) => {
      try {
          const response = await loginUser(rut, password);

          // ✅ Guarda los tokens en localStorage
          localStorage.setItem("access_token", response.access);
          localStorage.setItem("refresh_token", response.refresh);
          localStorage.setItem("user", JSON.stringify(response.user));

          return response;
      } catch (error) {
          return rejectWithValue("Error al iniciar sesión");
      }
  }
);

// ✅ Thunk para registrar usuario
export const registerThunk = createAsyncThunk(
  "auth/register",
  async ({ rut, email, password }: { rut: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      return await registerUser(rut, email, password);
    } catch (error) {
      return rejectWithValue("Error al registrar usuario");
    }
  }
);

// ✅ Thunk para cerrar sesión
export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
  logoutUser();
});

// Slice de autenticación
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(loginThunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(loginThunk.fulfilled, (state, action) => {
          state.user = action.payload.user;
          state.token = action.payload.access_token;
          state.isAuthenticated = true;
          state.loading = false;
        })
        .addCase(loginThunk.rejected, (state, action) => {
          state.error = action.payload as string;
          state.loading = false;
        })
        .addCase(logoutThunk.fulfilled, (state) => {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        });
    },
  });
  
  export default authSlice.reducer;