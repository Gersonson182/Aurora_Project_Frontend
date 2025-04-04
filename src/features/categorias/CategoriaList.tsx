import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { fetchCategoriesThunk, updateCategoryThunk, createCategoryThunk } from "./categoriaSlice";
import { showNotification } from "../../stores/notificationsSlice";
import { FaEdit, FaCheck, FaPlusCircle } from "react-icons/fa";

const CategoriaList = () => {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.categoriaSlice);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedValue, setEditedValue] = useState<string>("");
  const [newCategory, setNewCategory] = useState<string>("");

  useEffect(() => {
    dispatch(fetchCategoriesThunk());
  }, [dispatch]);

  // ✅ Editar categoría
  const handleEdit = (id: number, nombre: string) => {
    setEditingId(id);
    setEditedValue(nombre);
  };

  // ✅ Guardar cambios
  const handleSave = async () => {
    if (!editedValue.trim()) {
      dispatch(showNotification({ message: "El nombre no puede estar vacío", type: "error" }));
      return;
    }

    if (editingId === null) return;

    try {
      await dispatch(updateCategoryThunk({ id: editingId, nombre: editedValue })).unwrap();
      dispatch(showNotification({ message: "Categoría actualizada correctamente", type: "success" }));
      setEditingId(null);
    } catch {
      dispatch(showNotification({ message: "Error al actualizar la categoría", type: "error" }));
    }
  };

  // ✅ Agregar nueva categoría
  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      dispatch(showNotification({ message: "El nombre no puede estar vacío", type: "error" }));
      return;
    }

    try {
      await dispatch(createCategoryThunk(newCategory)).unwrap();
      dispatch(showNotification({ message: "Categoría añadida correctamente", type: "success" }));
      setNewCategory("");
    } catch {
      dispatch(showNotification({ message: "Error al añadir la categoría", type: "error" }));
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Gestión de Categorías</h2>

      {/* ✅ Formulario para agregar nueva categoría */}
      <div className="mb-4 flex space-x-2">
        <input
          type="text"
          placeholder="Nueva categoría"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        />
        <button
          onClick={handleAddCategory}
          className="bg-orange-500 text-white px-4 py-2 rounded flex items-center"
        >
          <FaPlusCircle className="mr-2" />
          Añadir
        </button>
      </div>

      {/* ✅ Tabla de Categorías */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id} className="border-t">
              <td className="px-4 py-2">
                {editingId === cat.id ? (
                  <input
                    type="text"
                    value={editedValue}
                    onChange={(e) => setEditedValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSave()}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  cat.nombre
                )}
              </td>
              <td className="px-4 py-2">
                {editingId === cat.id ? (
                  <button onClick={handleSave} className="bg-green-500 text-white px-2 py-1 rounded">
                    <FaCheck /> Guardar
                  </button>
                ) : (
                  <button onClick={() => handleEdit(cat.id, cat.nombre)} className="bg-orange-500 text-white px-2 py-1 rounded">
                    <FaEdit /> Editar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoriaList;


