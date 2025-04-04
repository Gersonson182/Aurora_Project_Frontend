import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CambioIngrediente } from "../../types";
import { 
    fetchRecipes, 
    deleteRecipe, 
    updateRecipe, 
    addProductToRecipe, 
    updateRecipePersonalizado,
    exportRecipes,
    getHistoricoDieta,
    addRestorarDieta,
    getDetalleHistoricoReceta,
    restoreRecipe
} from "./api";
import { Recipe, RecipeState, UpdateKilosPayload } from "../../types/index";

const initialState: RecipeState = {
    recipes: [],
    cambiosIngredientes: [], // ✅ Cambiado para evitar errores de tipado
    recetasHistoricas: {}, 
    recetaHistoricaSeleccionada: null,
    loading: false,
    error: null,
    etapaSeleccionada: null,
    customKilosPorEtapa: {}, 
    totals: {
        totalPorcentaje: 0,
        totalCostoSinIVA: 0,
        totalCostoConIVA: 0,
        totalKilogramos: 0,
        totalKilogramosPersonalizados: 0, 
    },
};




// Función para calcular los totales
const calculateTotals = (recipes: Recipe[], etapaId: number | null, customKilosPorEtapa: Record<number, number>) => {
    const filteredRecipes = etapaId ? recipes.filter((r) => r.etapa_id === etapaId) : recipes;
    return {
        totalPorcentaje: filteredRecipes.reduce((sum, receta) => sum + receta.porcentaje_tonelada, 0),
        totalKilogramos: filteredRecipes.reduce((sum, receta) => sum + receta.porcentaje_tonelada, 0) * 10,
        totalKilogramosPersonalizados: filteredRecipes.reduce((sum, receta) => sum + (receta.kilogramos_personalizados ?? 0), 0),
        totalCostoSinIVA: filteredRecipes.reduce((sum, receta) => sum + receta.costo_sin_iva, 0),
        totalCostoConIVA: filteredRecipes.reduce((sum, receta) => sum + receta.costo_con_iva, 0),
    };
};

// ✅Thunk para obtener las recetas
export const fetchRecipesThunk = createAsyncThunk(
    "recipes/fetchRecipes",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchRecipes();
            console.log("📌 Datos de recetas obtenidos:", response);

            if (!response || !Array.isArray(response)) {
                throw new Error("Los datos recibidos no son un array.");
            }

            // 🔹 Extraer kilogramos_personalizados de las recetas
            const kilosPorEtapa: Record<number, number> = {};
            response.forEach((receta) => {
                kilosPorEtapa[receta.etapa_id] = receta.kilogramos_personalizados ?? 0;
            });

            return { recipes: response, kilosPorEtapa };
        } catch (error) {
            console.error("⚠ Error en fetchRecipesThunk:", error);
            return rejectWithValue("Error al cargar recetas");
        }
    }
);

// Thunk para actualizar kilogramos personalizados
export const updateCustomKilosThunk = createAsyncThunk(
    "recipes/updateCustomKilos",
    async ({ etapaId, kilogramos }: { etapaId: number; kilogramos: number }, { dispatch, rejectWithValue }) => {
        try {
            const payload: UpdateKilosPayload = {
                etapa_id: etapaId,  
                kilogramos_personalizados: kilogramos,
            };
            await updateRecipePersonalizado(payload);
            await dispatch(fetchRecipesThunk());
            return { etapaId, kilogramos };
        } catch (error) {
            return rejectWithValue("Error al actualizar kilogramos personalizados");
        }
    }
);

// Thunk para agregar un producto a la receta
export const addProductToRecipeThunk = createAsyncThunk(
    "recipes/addProduct",
    async ({ etapaId, productId, porcentaje }: { etapaId: number; productId: number; porcentaje: number }, { rejectWithValue }) => {
        try {
            return await addProductToRecipe({ etapaId, productId, porcentaje });
        } catch (error) {
            return rejectWithValue("Error al añadir producto a la receta");
        }
    }
);

// Thunk para eliminar una receta
export const deleteRecipeThunk = createAsyncThunk(
    "recipes/deleteRecipe",
    async (id: number, { rejectWithValue }) => {
        try {
            await deleteRecipe(id);
            return id;
        } catch (error) {
            return rejectWithValue("Error al eliminar receta");
        }
    }
);

// Thunk para buscar histórico de recetas
export const historicoDieta = createAsyncThunk(
    "recipes/historicoDieta",
    async ({ fechaInicio, fechaFin, etapaId }: { fechaInicio: Date; fechaFin: Date; etapaId: number }, { rejectWithValue }) => {
        try {
            const response = await getHistoricoDieta({ fechaInicio, fechaFin, etapaId });

            // 🔍 Verificar la respuesta cruda en la consola
            console.log("Respuesta cruda de la API antes de mapear:", response);

            if (!Array.isArray(response)) {
                throw new Error("La respuesta del backend no es un array.");
            }

            // ✅ Mapear correctamente los datos incluyendo `producto_modificado`
            const cambiosFiltrados: CambioIngrediente[] = response.map((item: any) => {
                if (!item.producto_modificado) {
                    console.warn("⚠️ Ignorando cambio sin producto_modificado:", item);
                    return null;
                }

                return {
                    id: item.id,
                    producto_modificado: {
                        producto_id: item.producto_modificado.producto_id,
                        producto_nombre: item.producto_modificado.producto_nombre || "Desconocido",
                    },
                    porcentaje_total_anterior: item.porcentaje_total_anterior ?? 0,
                    porcentaje_total_actual: item.porcentaje_total_actual ?? 0,
                    fecha_creacion: item.fecha_creacion ?? "",
                };
            }).filter((cambio): cambio is CambioIngrediente => cambio !== null); // Filtramos valores nulos

            console.log("Cambios procesados correctamente:", cambiosFiltrados);

            return cambiosFiltrados;
        } catch (error: any) {
            console.error("Error al obtener el histórico de dietas:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data || "Error al encontrar receta");
        }
    }
);


export const fetchDetalleHistoricoReceta = createAsyncThunk(
    "recipes/fetchDetalleHistoricoReceta",
    async ({ historicoRecetaId }: { historicoRecetaId: number }, { rejectWithValue }) => {
        try {
            const response = await getDetalleHistoricoReceta({ historicoRecetaId });
            return response.data;
        } catch (error) {
            console.error("Error al obtener el detalle de la receta histórica:", error);
            return rejectWithValue("Error al cargar detalles de la receta.");
        }
    }
);

// Thunk para agregar la receta historica a receta actual
export const addRestorarDietaThunk = createAsyncThunk(
    "recipes/addHistoricoReceta",
    async ({ recetaId }: { recetaId: number}, { rejectWithValue }) => {
        try {
            const response = await addRestorarDieta({recetaId});
            return response.data
        } catch (error:any) {
            console.log("Error al añadir receta historica al actual:", error.response?.data || error.mesage)
            return rejectWithValue(error.response?.data || "Error al encontrar receta actual");
        }
    }
);

// Thunk para actualizar una receta (% tonelada)
export const updateRecipeThunk = createAsyncThunk(
    "recipes/updateRecipe",
    async ({ id, porcentaje_tonelada }: { id: number; porcentaje_tonelada: number }, { rejectWithValue }) => {
        try {
            return await updateRecipe({ id, porcentaje_tonelada });
        } catch (error) {
            return rejectWithValue("Error al actualizar receta");
        }
    }
);

// Exportar Datos Completos
export const exportRecipesThunk = createAsyncThunk(
  "recipes/exportRecipes",
  async (_, { rejectWithValue }) => {
    try {
      const data = await exportRecipes();
      // Asegurar que el archivo tenga el tipo correcto para Excel
      const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      // Crear URL para la descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "recetas_completas.xlsx"); // Asegurar que la extensión sea .xlsx
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Limpiar el DOM después de la descarga
      window.URL.revokeObjectURL(url); // Liberar memoria
    } catch (error) {
      console.error("Error al exportar recetas completas:", error);
      return rejectWithValue("Error al exportar recetas completas.");
    }
  }
);

// ✅ Thunk para restaurar receta desde el histórico
export const restoreRecipeThunk = createAsyncThunk(
    "recipes/restoreRecipe",
    async ({ historicoRecetaId }: { historicoRecetaId: number }, { dispatch, rejectWithValue }) => {
        try {
            const response = await restoreRecipe({ historicoRecetaId }); //  Usamos el nombre correcto de la API
            console.log("Receta restaurada correctamente:", response);

            // Actualizar Redux recargando las recetas después de restaurar
            await dispatch(fetchRecipesThunk());

            return response;
        } catch (error: any) {
            console.error(" Error al restaurar la receta:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data || "Error al restaurar receta");
        }
    }
);


// Slice de Redux
const recipeSlice = createSlice({
    name: "recipes",
    initialState,
    reducers: {
        setEtapaSeleccionada: (state, action) => {
            state.etapaSeleccionada = action.payload;
            state.totals = calculateTotals(state.recipes, action.payload, state.customKilosPorEtapa);
        },
        setCustomKilos: (state, action) => {
            const { etapaId, customKilos } = action.payload;
            state.customKilosPorEtapa = { ...state.customKilosPorEtapa, [etapaId]: customKilos };
            state.totals = calculateTotals(state.recipes, state.etapaSeleccionada, state.customKilosPorEtapa);
        },

        resetHistorico: (state) => {
            state.cambiosIngredientes = [];
            state.recetasHistoricas = {};
            state.recetaHistoricaSeleccionada = null;
            state.loading = false;
            state.error = null;
            state.etapaSeleccionada = null;
            state.customKilosPorEtapa = {};
            state.totals = {
                totalPorcentaje: 0,
                totalCostoSinIVA: 0,
                totalCostoConIVA: 0,
                totalKilogramos: 0,
                totalKilogramosPersonalizados: 0,
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRecipesThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.recipes = action.payload.recipes;
                state.customKilosPorEtapa = action.payload.kilosPorEtapa;
                state.totals = calculateTotals(state.recipes, state.etapaSeleccionada, state.customKilosPorEtapa);
            })
            .addCase(updateCustomKilosThunk.fulfilled, (state, action) => {
                if (action.payload) {
                    const { etapaId, kilogramos } = action.payload;
                    console.log("Actualizando Redux con nuevos kilos personalizados:", etapaId, kilogramos);
                    state.customKilosPorEtapa = { ...state.customKilosPorEtapa, [etapaId]: kilogramos };
                    state.totals = calculateTotals(state.recipes, state.etapaSeleccionada, state.customKilosPorEtapa);
                    console.log("Totales después de actualización:", state.totals);
                }
            })
            .addCase(addProductToRecipeThunk.fulfilled, (state, action) => {
                state.recipes.push(action.payload);
                state.totals = calculateTotals(state.recipes, state.etapaSeleccionada, state.customKilosPorEtapa);
            })
            .addCase(deleteRecipeThunk.fulfilled, (state, action) => {
                state.recipes = state.recipes.filter((recipe) => recipe.id !== action.payload);
                state.totals = calculateTotals(state.recipes, state.etapaSeleccionada, state.customKilosPorEtapa);
            })
            .addCase(updateRecipeThunk.fulfilled, (state, action) => {
                const index = state.recipes.findIndex((recipe) => recipe.id === action.payload.id);
                if (index !== -1) {
                    state.recipes[index] = action.payload;
                    state.totals = calculateTotals(state.recipes, state.etapaSeleccionada, state.customKilosPorEtapa);
                }
            })
            .addCase(historicoDieta.fulfilled, (state, action) => {
                state.loading = false;
                state.cambiosIngredientes = action.payload; // ✅ Directamente asignamos el resultado procesado
                console.log(" Cambios de ingredientes cargados:", state.cambiosIngredientes);
            })
            .addCase(addRestorarDietaThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchDetalleHistoricoReceta.fulfilled, (state, action) => {
                state.recetaHistoricaSeleccionada = action.payload;
            })

            .addCase(restoreRecipeThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(restoreRecipeThunk.fulfilled, (state, action) => {
                state.loading = false;
                console.log("Restauración de receta completada:", action.payload);
            })
            .addCase(restoreRecipeThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                console.error("Error al restaurar receta:", state.error);
            });
            
            
    },
});

export const { setEtapaSeleccionada, setCustomKilos, resetHistorico } = recipeSlice.actions; 
export default recipeSlice.reducer;
