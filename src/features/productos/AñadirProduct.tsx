import { useState } from "react";
import { useAppDispatch } from "../../stores/hooks";
import { createProductThunk } from "./productoSlice";
import { showNotification } from "../../stores/notificationsSlice";

const AñadirProducto = () => {
  const dispatch = useAppDispatch();
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");

  const handleAddProduct = async () => {
    if (!nombre.trim() || !precio.trim() || parseFloat(precio) <= 0) {
      dispatch(showNotification({ message: "Datos inválidos", type: "error" }));
      return;
    }

    try {
      await dispatch(createProductThunk({ nombre, precio_kilo: parseFloat(precio) })).unwrap();
      dispatch(showNotification({ message: "Producto añadido correctamente", type: "success" }));
      setNombre("");
      setPrecio("");
    } catch (error) {
      dispatch(showNotification({ message: "Error al añadir producto", type: "error" }));
    }
  };

  return (
    <div className="p-4 border rounded-md bg-gray-100">
      <h4 className="text-md font-semibold mb-2">Añadir Producto</h4>
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="border rounded px-2 py-1 w-full mb-2"
      />
      <input
        type="number"
        placeholder="Precio por Kg"
        value={precio}
        onChange={(e) => setPrecio(e.target.value)}
        className="border rounded px-2 py-1 w-full mb-2"
      />
      <button className="bg-orange-500 text-white px-4 py-2 rounded" onClick={handleAddProduct}>
        Añadir Producto
      </button>
    </div>
  );
};

export default AñadirProducto;
