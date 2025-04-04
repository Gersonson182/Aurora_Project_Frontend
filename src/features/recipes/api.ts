import apiClient from "../../services/ApiClient";

export const fetchRecipes = async () => {
  return await apiClient.get("/recetas/detalles/").then((res) => res.data);
};

// Agregar Producto a la Receta
export const addProductToRecipe = async ({ etapaId, productId, porcentaje }: { etapaId: number; productId: number; porcentaje: number }) => {
  return await apiClient.post("/recetas/", {
    etapa: etapaId,  //  Debe ser "etapa"
    producto: productId,  //  Debe ser "producto"
    porcentaje_tonelada: porcentaje  //  Debe ser "porcentaje_tonelada"
  }).then((res) => res.data);
};

//  Eliminar Receta
export const deleteRecipe = async (id: number) => {
  return await apiClient.delete(`/recetas/${id}/`);
};

// Actualizar % de Tonelada
export const updateRecipe = async ({ id, porcentaje_tonelada }: { id: number; porcentaje_tonelada: number }) => {
  return await apiClient.patch(`/recetas/${id}/`, { porcentaje_tonelada }).then((res) => res.data);
};

// Actualizar Kilogramos Personalizados
export const updateRecipePersonalizado = async (payload: { etapa_id: number; kilogramos_personalizados: number }) => {
  return await apiClient.patch(`/recetas/update_kilogramos/${payload.etapa_id}/`, {
    kilogramos_personalizados: payload.kilogramos_personalizados,
  });
};

// Exportar Recetas
export const exportRecipes = async () => {
  return await apiClient.get("/export/datos/", { responseType: "blob" }).then((res) => res.data);
};

//Buscar historico fechas
// Buscar histórico de recetas por fechas
export const getHistoricoDieta = async ({ fechaInicio, fechaFin, etapaId }: { fechaInicio: Date, fechaFin: Date, etapaId: number }) => {
  try {
      const fechaInicioFormatted = fechaInicio.toISOString().split("T")[0];
      const fechaFinFormatted = fechaFin.toISOString().split("T")[0];

      // 🔹 Realizar la solicitud GET
      const response = await apiClient.get(`/historico/recetas/?fecha_inicio=${fechaInicioFormatted}&fecha_fin=${fechaFinFormatted}&etapa_id=${etapaId}`);

      // ✅ Verificar la respuesta en la consola antes de enviarla a Redux
      console.log("📡 Respuesta cruda de la API antes de Redux:", response.data);

      // ⚠️ Verificar si la respuesta es un array válido
      if (!Array.isArray(response.data)) {
          console.error(" La API no devolvió un array:", response.data);
          throw new Error("Formato de datos inválido");
      }

      return response.data;
  } catch (error: any) {
      console.error(" Error en getHistoricoDieta:", error.response?.data || error.message);
      throw error;
  }
};



// Obtener la receta completa por historico_receta_id
export const getDetalleHistoricoReceta = async ({ historicoRecetaId }: { historicoRecetaId: number }) => {
  return await apiClient.get(`/historico/receta/${historicoRecetaId}/`);
};


//Remplazar historico de la receta 
export const addRestorarDieta = async ({recetaId}: {recetaId:number}) => {
  try{
    const response = await apiClient.post("/recetas/restaurar/",{
      receta_id: recetaId,
    });
    return response.data;
  } catch(error:any){
    console.log("Error al restaurar la receta", error.response?.data || error);
    throw error.response?.data || 'Error desconocido al restaurar receta';
  }

}

// Restaurar Receta desde el Histórico
export const restoreRecipe = async ({ historicoRecetaId }: { historicoRecetaId: number }) => {
  try {
    const response = await apiClient.post("/recetas/restaurar/", {
      historico_receta_id: historicoRecetaId, // Asegurar que se envía con la clave correcta
    });

    console.log("Receta restaurada correctamente:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error al restaurar la receta:", error.response?.data || error.message);
    throw error.response?.data || "Error desconocido al restaurar la receta";
  }
};














 
  

