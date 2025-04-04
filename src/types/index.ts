
export type NotificationType = {
    message: string,
    type: "success" | "error";
}

// Tipo para representar un Producto
export interface Producto {
    id: number;
    nombre: string;
    precio_kilo: number;
    categoria?: string; // Opcional
  }
  
  // Tipo para representar una Etapa de Crecimiento
  export interface EtapaCrecimiento {
    id: number;
    nombre: string;
    semana_inicial: number;
    semana_final: number;
  }
  
  // Tipo para representar una Receta
  export interface Recipe {
    id: number;
    producto: string;
    etapa_id: number;
    porcentaje_tonelada: number;
    costo_sin_iva: number;
    costo_con_iva: number;
    kilogramos_personalizados?: number; // ✅ Puede ser opcional en caso de no estar presente
  }
  

  export interface Totals {
    totalPorcentaje: number;
    totalCostoSinIVA: number;
    totalCostoConIVA: number;
    totalKilogramos: number;
    totalKilogramosPersonalizados: number;
  }
  
export interface ProductoModificado {
    producto_id: number;
    producto_nombre: string;
}

export interface CambioIngrediente {
    id: number;
    producto_modificado: ProductoModificado; // 🔹 Se asegura que siempre exista
    porcentaje_total_anterior: number | null;
    porcentaje_total_actual: number;
    fecha_creacion: string;
}


export interface IngredienteDetalle {
    producto_id: number;
    producto_nombre: string;
    porcentaje_tonelada: number;
    kilogramos?: number | null;  // 🔹 Aseguramos que pueda ser `null`
    costo_sin_iva: number;
    costo_con_iva: number;
}

export interface DetalleHistoricoReceta {
    receta_id: number;
    etapa: string;
    fecha_actualizacion: string;
    ingredientes: IngredienteDetalle[];
    porcentaje_total: number;
}

// 🔹 Estado de Redux
export interface RecipeState {
    recipes: Recipe[];
    cambiosIngredientes: CambioIngrediente[];
    recetasHistoricas: { [id: number]: DetalleHistoricoReceta };
    recetaHistoricaSeleccionada: DetalleHistoricoReceta | null;
    loading: boolean;
    error: string | null;
    etapaSeleccionada: number | null;
    customKilosPorEtapa: { [etapaId: number]: number };
    totals: {
        totalPorcentaje: number;
        totalCostoSinIVA: number;
        totalCostoConIVA: number;
        totalKilogramos: number;
        totalKilogramosPersonalizados: number;
    };
}

// Tipo para representar un Producto
export interface Product {
    id: number;
    nombre: string;
    precio_kilo: number;
    categoria?: number | null;  // Cambiado a ID numérico o null
    categoria_nombre?: string;  // Nuevo campo opcional con el nombre de la categoría
    proveedor?: number | null;  // Cambiado a ID numérico o null
    proveedor_nombre?: string;  // Nuevo campo opcional con el nombre del proveedor
    fecha_actualizacion?: string; // Opcional, ISO string de la última actualización
    activo: boolean;
}

  
  // Tipo para el estado de Redux de productos
  export interface ProductState {
    products: Product[];
    loading: boolean;
    error: string | null;
  }

  export interface Categoria {
    id: number;
    nombre: string;
  }
  
  export interface Proveedor {
    id: number;
    nombre: string;
    contacto: string;
  }
  
  export interface UpdateKilosPayload {
    etapa_id: number;  // 🔹 Backend usa `etapa_id`
    kilogramos_personalizados: number; // 🔹 Backend usa `kilogramos_personalizados`
}
