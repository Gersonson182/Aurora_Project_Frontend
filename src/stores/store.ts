import {configureStore} from '@reduxjs/toolkit'
import notificationsReducer from "./notificationsSlice"
import recipeReducer from '../features/recipes/recipeSlice'
import productoReducer from '../features/productos/productoSlice'
import validationNotificationReducer from './validacionNotificationSlice'
import categoriaReducer from '../features/categorias/categoriaSlice'
import proveedorReducer from '../features/proveedores/proveedorSlice'
import authReducer from "../features/auth/authSlice";


export const store = configureStore({
    reducer: {
        notifications: notificationsReducer,
        recipeSlice: recipeReducer,
        validationNotification: validationNotificationReducer,
        productoSlice : productoReducer,
        categoriaSlice : categoriaReducer,
        proveedorSlice : proveedorReducer,
        authSlice : authReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;