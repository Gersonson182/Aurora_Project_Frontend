import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../stores/hooks"; // 🔹 Importar useAppDispatch
import { updateCustomKilosThunk, fetchRecipesThunk } from "./recipeSlice"; // 🔹 Importar acción de Redux

interface CustomKilosModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (etapaId: number, customKilos: number) => void;
    etapaId: number | null; // Recibe la etapa seleccionada
}

const CustomKilosModal: React.FC<CustomKilosModalProps> = ({ isOpen, onClose, onSave, etapaId }) => {
    const [inputValue, setInputValue] = useState("");
    const dispatch = useAppDispatch(); // ✅ Obtener dispatch

    // Limpiar input cada vez que se abre el modal
    useEffect(() => {
        if (isOpen) {
            setInputValue("");
        }
    }, [isOpen]);

    const handleSave = () => {
        const kilos = parseFloat(inputValue);
    
        if (!isNaN(kilos) && kilos > 0 && etapaId !== null) {
            console.log("Guardando kilogramos personalizados:", kilos);
    
            // Enviar actualización a Redux y Backend
            dispatch(updateCustomKilosThunk({ etapaId, kilogramos: kilos }))
                .unwrap()
                .then(() => {
                    console.log("✅ Actualización exitosa, recargando recetas...");
                    dispatch(fetchRecipesThunk()); // ✅ Volver a obtener los datos
                })
                .catch((error) => {
                    console.error("Error al actualizar kilogramos personalizados:", error);
                });
    
            onClose();
        } else {
            alert("Por favor, ingresa un valor válido y asegúrate de que hay una etapa seleccionada.");
        }
    };
    
    if (!isOpen) return null;

    return (
        <div className="modal-overlay fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center">
            <div className="modal-content bg-white p-6 rounded shadow-lg w-1/3">
                <h2 className="text-lg font-bold mb-4">Configurar Kilogramos Personalizados</h2>
                <p className="text-gray-600 mb-2">Etapa Seleccionada: <strong>{etapaId || "No seleccionada"}</strong></p>
                <input
                    type="number"
                    className="border rounded px-2 py-1 w-full mb-4"
                    placeholder="Ejemplo: 350"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <div className="flex justify-end space-x-4">
                    <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={onClose}>Cancelar</button>
                    <button className="bg-orange-500 text-white px-4 py-2 rounded" onClick={handleSave}>Guardar</button>
                </div>
            </div>
        </div>
    );
};

export default CustomKilosModal;


