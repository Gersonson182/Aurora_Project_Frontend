import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { fetchProvidersThunk, updateProviderThunk, createProviderThunk } from "./proveedorSlice";
import { showNotification } from "../../stores/notificationsSlice";
import { FaEdit, FaCheck, FaPlusCircle } from "react-icons/fa";

const ProveedorList = () => {
  const dispatch = useAppDispatch();
  const { providers } = useAppSelector((state) => state.proveedorSlice);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedNombre, setEditedNombre] = useState<string>("");
  const [editedContacto, setEditedContacto] = useState<string>("");
  const [newNombre, setNewNombre] = useState<string>("");
  const [newContacto, setNewContacto] = useState<string>("");

  useEffect(() => {
    dispatch(fetchProvidersThunk());
  }, [dispatch]);

  // ✅ Editar proveedor
  const handleEdit = (id: number, nombre: string, contacto: string) => {
    setEditingId(id);
    setEditedNombre(nombre);
    setEditedContacto(contacto);
  };

  // ✅ Guardar cambios
  const handleSave = async () => {
    if (!editedNombre.trim() || !editedContacto.trim()) {
      dispatch(showNotification({ message: "Los campos no pueden estar vacíos", type: "error" }));
      return;
    }

    if (editingId === null) return;

    try {
      await dispatch(updateProviderThunk({ id: editingId, nombre: editedNombre, contacto: editedContacto })).unwrap();
      dispatch(showNotification({ message: "Proveedor actualizado correctamente", type: "success" }));
      setEditingId(null);
    } catch {
      dispatch(showNotification({ message: "Error al actualizar el proveedor", type: "error" }));
    }
  };

  // ✅ Agregar nuevo proveedor
  const handleAddProvider = async () => {
    if (!newNombre.trim() || !newContacto.trim()) {
      dispatch(showNotification({ message: "Los campos no pueden estar vacíos", type: "error" }));
      return;
    }

    try {
      await dispatch(createProviderThunk({ nombre: newNombre, contacto: newContacto })).unwrap();
      dispatch(showNotification({ message: "Proveedor añadido correctamente", type: "success" }));
      setNewNombre("");
      setNewContacto("");
    } catch {
      dispatch(showNotification({ message: "Error al añadir el proveedor", type: "error" }));
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Gestión de Proveedores</h2>

      {/* ✅ Formulario para agregar nuevo proveedor */}
      <div className="mb-4 flex space-x-2">
        <input
          type="text"
          placeholder="Nombre del proveedor"
          value={newNombre}
          onChange={(e) => setNewNombre(e.target.value)}
          className="border rounded px-2 py-1 w-1/3"
        />
        <input
          type="text"
          placeholder="Contacto"
          value={newContacto}
          onChange={(e) => setNewContacto(e.target.value)}
          className="border rounded px-2 py-1 w-1/3"
        />
        <button
          onClick={handleAddProvider}
          className="bg-orange-500 text-white px-4 py-2 rounded flex items-center"
        >
          <FaPlusCircle className="mr-2" />
          Añadir
        </button>
      </div>

      {/* ✅ Tabla de Proveedores */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Contacto</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {providers.map((prov) => (
            <tr key={prov.id} className="border-t">
              <td className="px-4 py-2">
                {editingId === prov.id ? (
                  <input type="text" value={editedNombre} onChange={(e) => setEditedNombre(e.target.value)} className="border rounded px-2 py-1 w-full" />
                ) : (
                  prov.nombre
                )}
              </td>
              <td className="px-4 py-2">
                {editingId === prov.id ? (
                  <input type="text" value={editedContacto} onChange={(e) => setEditedContacto(e.target.value)} className="border rounded px-2 py-1 w-full" />
                ) : (
                  prov.contacto
                )}
              </td>
              <td className="px-4 py-2">
                {editingId === prov.id ? (
                  <button onClick={handleSave} className="bg-green-500 text-white px-2 py-1 rounded"><FaCheck /> Guardar</button>
                ) : (
                  <button onClick={() => handleEdit(prov.id, prov.nombre, prov.contacto)} className="bg-orange-500 text-white px-2 py-1 rounded"><FaEdit /> Editar</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProveedorList;
