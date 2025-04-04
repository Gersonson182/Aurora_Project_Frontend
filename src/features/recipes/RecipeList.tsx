import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import {
  fetchRecipesThunk,
  deleteRecipeThunk,
  updateRecipeThunk,
  setEtapaSeleccionada,
  setCustomKilos,
  exportRecipesThunk
} from "./recipeSlice";
import { Recipe } from "../../types";
import { showValidationNotification } from "../../stores/validacionNotificationSlice";
import { showNotification } from "../../stores/notificationsSlice";
import NotificacionValidacion from "../../components/ValidacionNotification";
import Notification from "../../components/Notification";
import ModalRecetaProducto from "./ModalRecetaProducto";
import CustomKilosModal from "./ModalAdicional"; // Modal personalizado
import { FaEdit, FaTrash, FaCheck, FaPlusCircle } from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const etapas = [
  { id: 1, nombre: "Pollita 1-8 semanas" },
  { id: 2, nombre: "Recria 9-19 semanas" },
  { id: 3, nombre: "Pre-postura"},
  { id: 4, nombre: "Ponedora Incial 20-55 semanas" },
  { id: 5, nombre: "Ponedora Final 56-110 semanas" },
];

const COLORS = [
  "#FFBB28",
  "#FF8042",
  "#0088FE",
  "#00C49F",
  "#FF4560",
  "#775DD0",
  "#00E396",
  "#FEB019",
  "#FF6699",
  "#663399",
  "#FFC75F",
  "#F9A825",
];

const RecipeList = () => {
  const [isCustomKilosModalOpen, setIsCustomKilosModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { recipes, totals, etapaSeleccionada, customKilosPorEtapa } = useAppSelector((state) => state.recipeSlice);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedValue, setEditedValue] = useState<string>("");
  const [pendingSave, setPendingSave] = useState<Recipe | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const dispatch = useAppDispatch();

  const handleExportRecipes = () => {
    dispatch(exportRecipesThunk());
  }

  const handleOpenCustomKilosModal = () => {
    setIsCustomKilosModalOpen(true);
  };

  const handleCloseCustomKilosModal = () => {
    setIsCustomKilosModalOpen(false);
  };


  useEffect(() => {
    dispatch(fetchRecipesThunk());
  }, [dispatch]);

  // Manejar clic fuera para desactivar edición
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isInsideTable = !!target.closest(".recipe-table");
      if (!isInsideTable) {
        setEditingId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const recetasFiltradas = etapaSeleccionada
    ? recipes.filter((r) => r.etapa_id === etapaSeleccionada)
    : [];

  const chartData = recetasFiltradas.map((receta) => ({
    name: receta.producto,
    value: receta.porcentaje_tonelada,
  }));

  const handleEdit = (recipe: Recipe) => {
    setEditingId(recipe.id);
    setEditedValue(recipe.porcentaje_tonelada.toString());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedValue(e.target.value);
  };

  const handleSaveRequest = (recipe: Recipe) => {
    const newPercentage = parseFloat(editedValue);

    if (isNaN(newPercentage)) {
      dispatch(showNotification({ message: "Valor inválido", type: "error" }));
      return;
    }

    const totalActual = totals.totalPorcentaje - recipe.porcentaje_tonelada + newPercentage;
    if (totalActual > 100) {
      dispatch(showNotification({ message: "El total no puede superar el 100%", type: "error" }));
      return;
    }

    setPendingSave({
      ...recipe,
      porcentaje_tonelada: newPercentage,
    });

    dispatch(
      showValidationNotification({
        message: "¿Deseas guardar los cambios?",
        actionType: "update",
      })
    );
  };

  const handleConfirmSave = async () => {
    if (pendingSave) {
      try {
        await dispatch(
          updateRecipeThunk({
            id: pendingSave.id,
            porcentaje_tonelada: pendingSave.porcentaje_tonelada,
          })
        );
        dispatch(fetchRecipesThunk());
        dispatch(showNotification({ message: "Receta actualizada correctamente.", type: "success" }));
      } catch (error) {
        dispatch(showNotification({ message: "Error al actualizar la receta.", type: "error" }));
      } finally {
        setEditingId(null);
        setPendingSave(null);
      }
    }
  };

  const handleDeleteRequest = (id: number) => {
    setPendingDeleteId(id);
    dispatch(
      showValidationNotification({
        message: "¿Estás seguro de eliminar esta receta?",
        actionType: "delete",
      })
    );
  };

  const handleConfirmDelete = async () => {
    if (pendingDeleteId !== null) {
      try {
        await dispatch(deleteRecipeThunk(pendingDeleteId));
        dispatch(fetchRecipesThunk());
        dispatch(showNotification({ message: "Receta eliminada correctamente.", type: "success" }));
      } catch (error) {
        dispatch(showNotification({ message: "Error al eliminar la receta.", type: "error" }));
      } finally {
        setPendingDeleteId(null);
      }
    }
  };

  const handleAddProductClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleKgChange = (e: React.ChangeEvent<HTMLInputElement>, recipe: Recipe) => {
    let newKilos = e.target.value;
  
    if (newKilos === "") {
      setEditedValue(""); // Permite que el usuario borre el campo temporalmente
      return;
    }
  
    const kilosNumber = parseFloat(newKilos);
  
    if (isNaN(kilosNumber)) {
      dispatch(showNotification({ message: "Valor inválido", type: "error" }));
      return;
    }
  
    const newPercentage = kilosNumber / 10;
    setEditedValue(newPercentage.toString()); //  Guarda el porcentaje sin `.00` hasta que se complete la edición
  };
  

  return (
    <div>
      <div className="flex space-x-4 mb-4">
        {etapas.map((etapa) => (
          <button
            key={etapa.id}
            onClick={() => dispatch(setEtapaSeleccionada(etapa.id))}
            className={`px-4 py-2 rounded ${
              etapaSeleccionada === etapa.id
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {etapa.nombre}
          </button>
        ))}
      </div>

      <div className="flex">
        <div className="w-2/3 recipe-table relative">
          <h3 className="text-lg font-semibold mb-4">
            DIETAS - {etapas.find((e) => e.id === etapaSeleccionada)?.nombre || "Selecciona una etapa"}
          </h3>

          {!etapaSeleccionada ? (
            <p className="text-gray-600">Por favor, selecciona una etapa para ver las recetas.</p>
          ) : (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th>Producto</th>
                  <th>% Tonelada</th>
                  <th>Kilogramos</th>
                  <th>Costo Sin IVA</th>
                  <th>Costo IVA</th>
                  <th>Kg(Per.)</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {recetasFiltradas.map((recipe) => (
                  <tr key={recipe.id}>
                    <td>{recipe.producto}</td>
                    <td className="text-orange-500 font-bold">
                      {editingId === recipe.id ? (
                        <input
                          type="number"
                          value={editedValue}
                          onChange={handleChange}
                          autoFocus
                          onBlur={() => setEditedValue(parseFloat(editedValue).toFixed(2))} // Aplica formato cuando se pierde el foco
                        />
                      ) : (
                        <span>{recipe.porcentaje_tonelada.toFixed(2)}</span> //  Muestra con formato solo cuando no está en edición
                      )}
                    </td>

                    <td className="text-orange-500 font-bold">
                      {editingId === recipe.id ? (
                        <input
                          type="number"
                          value={editedValue ? (parseFloat(editedValue) * 10).toString() : ""}
                          onChange={(e) => handleKgChange(e, recipe)}
                          onBlur={(e) => {
                            const value = parseFloat(e.target.value) / 10;
                            setEditedValue(value.toFixed(2)); // Solo formatea cuando se termina de editar
                          }}
                        />
                      ) : (
                        <span>{(recipe.porcentaje_tonelada * 10).toFixed(2)} kg</span>
                      )}
                    </td>
                    <td>${recipe.costo_sin_iva.toFixed(2)}</td>
                    <td>${recipe.costo_con_iva.toFixed(2)}</td>
                    <td className="text-blue-500 font-bold">{recipe.kilogramos_personalizados?.toFixed(2)}kg</td>
                    <td>
                      {editingId === recipe.id ? (
                        <button onClick={() => handleSaveRequest(recipe)}>
                          <FaCheck />
                        </button>
                      ) : (
                        <button onClick={() => handleEdit(recipe)}>
                          <FaEdit />
                        </button>
                      )}
                      <button onClick={() => handleDeleteRequest(recipe.id)}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="font-bold bg-gray-100">
                  <td>Totales</td>
                  <td>{totals.totalPorcentaje.toFixed(2)}%</td>
                  <td>{totals.totalKilogramos.toFixed(2)}</td>
                  <td>${totals.totalCostoSinIVA.toFixed(2)}</td>
                  <td>${totals.totalCostoConIVA.toFixed(2)}</td>
                  <td>{totals.totalKilogramosPersonalizados.toFixed(2)} kg</td> 
                  <td></td>
               
                </tr>
              </tbody>
            </table>
          )}

<div className="mt-3 flex space-x-4">
  {etapaSeleccionada && totals.totalPorcentaje < 110 && (
    <button
      className="mt-4 bg-orange-500 text-white px-4 py-2 rounded flex items-center"
      onClick={handleAddProductClick}
    >
      <FaPlusCircle className="mr-2" />
      Añadir Producto
    </button>
  )}
  {etapaSeleccionada && totals.totalPorcentaje < 110 && (
    <button
      className="mt-4 bg-blue-500 text-white px-4 py-2 rounded flex items-center"
      onClick={handleOpenCustomKilosModal}
    >
      <FaPlusCircle className="mr-2" />
      Personalizar Kg Dieta
    </button>
  )}
  {etapaSeleccionada && totals.totalPorcentaje < 110 && (
    <button
      className="mt-4 bg-green-500 text-white px-4 py-2 rounded flex items-center"
      onClick={handleExportRecipes}
    >
      Exportar a Excel
    </button>
  )}
 
</div>
 </div>
        <div className="w-1/3 flex items-center justify-center">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <ModalRecetaProducto
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        etapaId={etapaSeleccionada || 0}
      />

<CustomKilosModal
    isOpen={isCustomKilosModalOpen}
    onClose={handleCloseCustomKilosModal}
    etapaId={etapaSeleccionada ?? 0} // Evita valores null pasándolo a 0 si es necesario
    onSave={(etapaId, kilos) => {
        if (etapaId === 0) {
            console.error(" Error: No se ha seleccionado una etapa.");
            dispatch(showNotification({ message: "Selecciona una etapa antes de personalizar.", type: "error" }));
            return;
        }

        console.log(`🟡 Actualizando kilogramos personalizados: ${kilos} en etapa: ${etapaId}`);
        
        dispatch(setCustomKilos({ etapaId, customKilos: kilos }));
        dispatch(fetchRecipesThunk())
            .then(() => dispatch(showNotification({ message: "Capacidad personalizada guardada.", type: "success" })))
            .catch(() => dispatch(showNotification({ message: "Error al actualizar la capacidad.", type: "error" })));
    }}
/>
            
      <NotificacionValidacion onConfirmSave={handleConfirmSave} onConfirmDelete={handleConfirmDelete} />
      <Notification />
    </div>
  );
};

export default RecipeList;













