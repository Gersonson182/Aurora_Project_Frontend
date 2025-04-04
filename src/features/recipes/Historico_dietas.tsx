import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { historicoDieta, fetchDetalleHistoricoReceta, restoreRecipeThunk } from "./recipeSlice";
import { showNotification } from "../../stores/notificationsSlice";
import { showValidationNotification, hideValidationNotification } from "../../stores/validacionNotificationSlice";
import Notification from "../../components/Notification";
import ValidacionNotificacion from "../../components/ValidacionNotification"; 
import { resetHistorico } from "./recipeSlice";

const HistoricoDietas = () => {
    const dispatch = useAppDispatch();
    const { cambiosIngredientes, recetaHistoricaSeleccionada, loading } = useAppSelector((state) => state.recipeSlice);
    const { isVisible, actionType } = useAppSelector((state) => state.validationNotification);

    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [etapaSeleccionada, setEtapaSeleccionada] = useState("");
    const [recetaAConfirmar, setRecetaAConfirmar] = useState<number | null>(null);

    useEffect(() => {
        return () => {
            dispatch(resetHistorico());
        };
    }, [dispatch]);

    const handleSearch = () => {
        if (!fechaInicio || !fechaFin) {
            dispatch(showNotification({ message: "Debes seleccionar ambas fechas.", type: "error" }));
            return;
        }

        if (!etapaSeleccionada) {
            dispatch(showNotification({ message: "Debes seleccionar una etapa.", type: "error" }));
            return;
        }

        dispatch(
            historicoDieta({
                fechaInicio: new Date(fechaInicio),
                fechaFin: new Date(fechaFin),
                etapaId: Number(etapaSeleccionada),
            })
        );
    };

    const formatFecha = (fecha: string) => {
        return new Intl.DateTimeFormat("es-CL", {
            year: "numeric",
            month: "long",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(fecha));
    };

    const handleSelectIngredient = (historicoRecetaId: number, cambioId: number) => {
      setRecetaAConfirmar(cambioId); // ✅ Guarda el ID correcto para restaurar
      dispatch(fetchDetalleHistoricoReceta({ historicoRecetaId }));
  };
    // 🔹 Mostrar la confirmación antes de restaurar la receta
    const handleShowConfirmRestore = (recetaId: number) => {
        setRecetaAConfirmar(recetaId);
        dispatch(
            showValidationNotification({
                message: "¿Estás seguro de que quieres restablecer esta dieta?",
                actionType: "delete", // ✅ Usamos "delete" porque `onConfirmDelete` se usa para acciones destructivas
            })
        );
    };

    // Función para restaurar la receta después de la confirmación
    const handleRestoreRecipe = async () => {
      if (recetaAConfirmar !== null) {
          console.log("📌 ID de receta que debería restaurarse:", recetaAConfirmar); // Agregado para depurar
  
          try {
              await dispatch(restoreRecipeThunk({ historicoRecetaId: recetaAConfirmar }));
              dispatch(showNotification({ message: "Receta restaurada correctamente", type: "success" }));
          } catch (error) {
              dispatch(showNotification({ message: "Error al restaurar receta", type: "error" }));
          } finally {
              setRecetaAConfirmar(null);
          }
      }
  };
  

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Histórico de Dietas</h1>

            <div className="flex space-x-4 mb-6">
                <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className="border rounded p-2" />
                <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} className="border rounded p-2" />
                <select value={etapaSeleccionada} onChange={(e) => setEtapaSeleccionada(e.target.value)} className="border rounded p-2">
                    <option value="">Seleccionar Etapa</option>
                    <option value="1">Pollita 1-8 semanas</option>
                    <option value="2">Recría 9-19 semanas</option>
                    <option value="3">Pre-postura</option>
                    <option value="4">Ponedora Inicial 20-55 semanas</option>
                    <option value="5">Ponedora Final 56-110 semanas</option>
                </select>
                <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded">Buscar</button>
            </div>

            {loading && <p>Cargando...</p>}

            {!loading && cambiosIngredientes.length > 0 ? (
                <div>
                    <h2 className="text-lg font-bold mb-2">Cambios de Ingredientes</h2>
                    {cambiosIngredientes
                        .filter((cambio) => cambio.producto_modificado)
                        .map((cambio) => (
                            <div key={cambio.id} className="mb-4">
                  
                                <h3 className="font-semibold">{new Date(cambio.fecha_creacion).toLocaleString()}</h3>
                                <p>
                                    {cambio.producto_modificado!.producto_nombre} - 
                                    Antes: {cambio.porcentaje_total_anterior?.toFixed(2) ?? "N/A"}% → 
                                    Ahora: {cambio.porcentaje_total_actual.toFixed(2)}%
                                </p>
                                <button 
                                    className="bg-gray-300 px-3 py-1 rounded"
                                    onClick={() => handleSelectIngredient(cambio.id, cambio.id)}
                                >
                                    Ver Receta Completa
                                </button>
                            </div>
                        ))
                    }
                </div>
            ) : (
                <p>No se encontraron cambios de ingredientes.</p>
            )}

            {recetaHistoricaSeleccionada && (
                <div className="mt-6">
                    <h2 className="text-lg font-bold mb-2">Dieta Histórica</h2>
                    <p className="text-sm">
                        <strong>Fecha de actualización:</strong> {formatFecha(recetaHistoricaSeleccionada.fecha_actualizacion)}
                    </p>
                    <p className="text-sm font-semibold"><strong>Etapa:</strong> {recetaHistoricaSeleccionada.etapa}</p>

                    <table className="w-full border-collapse border border-gray-300 mt-4">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2">Producto</th>
                                <th className="border p-2">% Tonelada</th>
                                <th className="border p-2">Kilogramos Personalizado</th>
                                <th className="border p-2">Costo Sin IVA</th>
                                <th className="border p-2">Costo Con IVA</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recetaHistoricaSeleccionada.ingredientes.map((ing, index) => (
                                <tr key={index} className="text-center">
                                  <td className="border p-2">{ing.producto_nombre}</td>
                                  <td className="border p-2">{ing.porcentaje_tonelada?.toFixed(2) ?? "0.00"}%</td>
                                  <td className="border p-2">{ing.kilogramos ? `${ing.kilogramos.toFixed(2)} kg` : 'N/A'}</td>
                                  <td className="border p-2">${ing.costo_sin_iva?.toFixed(2) ?? "0.00"}</td>
                                  <td className="border p-2">${ing.costo_con_iva?.toFixed(2) ?? "0.00"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className="bg-orange-400 text-white px-4 py-2 rounded mt-4" 
                        onClick={() => handleShowConfirmRestore(recetaAConfirmar!)}
                    >
                        Restablecer Dieta
                    </button>
                </div>
            )}

            {isVisible && actionType === "delete" && (
                <ValidacionNotificacion 
                    onConfirmSave={() => {}}  
                    onConfirmDelete={handleRestoreRecipe}  
                />
            )}

            <Notification />
        </div>
    );
};

export default HistoricoDietas;
















