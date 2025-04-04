import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { fetchCategoriesThunk } from "../categorias/categoriaSlice";
import { fetchProvidersThunk } from "../proveedores/proveedorSlice";
import { fetchProductsThunk, createProductThunk, deactivateProductThunk } from "./productoSlice";
import { showNotification } from "../../stores/notificationsSlice";
import { showValidationNotification } from "../../stores/validacionNotificationSlice";
import { Categoria, Proveedor, Product } from "../../types";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import NotificacionValidacion from "../../components/ValidacionNotification";
import Notification from "../../components/Notification";

const ProductList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Estados del formulario
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Categoria | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Proveedor | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  // Cargar datos al montar el componente
  useEffect(() => {
    dispatch(fetchCategoriesThunk());
    dispatch(fetchProvidersThunk());
    dispatch(fetchProductsThunk());
  }, [dispatch]);

  const { categories } = useAppSelector((state) => state.categoriaSlice);
  const { providers } = useAppSelector((state) => state.proveedorSlice);
  const { products } = useAppSelector((state) => state.productoSlice);

  const handleAddProduct = async () => {
    if (!nombre.trim()) {
      dispatch(showNotification({ message: "El campo 'Nombre' no puede estar vacío.", type: "error" }));
      return;
    }
    if (!precio.trim() || isNaN(Number(precio)) || parseFloat(precio) <= 0) {
      dispatch(showNotification({ message: "El campo 'Precio por Kg' debe ser un número positivo.", type: "error" }));
      return;
    }

    try {
      const newProduct: Product = {
        id: 0,
        nombre,
        precio_kilo: parseFloat(precio),
        categoria: selectedCategory?.id || null,
        proveedor: selectedProvider?.id || null,
        activo: true,
      };

      await dispatch(createProductThunk(newProduct)).unwrap();
      dispatch(showNotification({ message: "Producto añadido correctamente.", type: "success" }));
      setNombre("");
      setPrecio("");
      setSelectedCategory(null);
      setSelectedProvider(null);
    } catch (error) {
      dispatch(showNotification({ message: "Error al añadir producto.", type: "error" }));
    }
  };

  const handleEditProduct = (id: number) => {
    navigate(`/insumos/productos/editar/${id}`);
  };

  const handleDeleteProductRequest = (id: number) => {
    setPendingDeleteId(id);
    dispatch(showValidationNotification({ message: "¿Estás seguro de eliminar este producto?", actionType: "delete" }));
  };

  const handleConfirmDelete = async () => {
    if (pendingDeleteId !== null) {
      try {
        await dispatch(deactivateProductThunk(pendingDeleteId)).unwrap();
        dispatch(showNotification({ message: "Producto desactivado correctamente.", type: "success" }));
        dispatch(fetchProductsThunk());
      } catch (error) {
        dispatch(showNotification({ message: "Error al desactivar producto.", type: "error" }));
      } finally {
        setPendingDeleteId(null);
      }
    }
  };

  return (
    <div className="p-6">
      <Notification />
      <h4 className="text-xl font-bold mb-4">Gestión de Productos</h4>

      {/* Formulario para añadir producto */}
      <div className="p-4 border rounded-md bg-gray-100 mb-6">
        <h4 className="text-md font-semibold mb-2">Añadir Producto</h4>

        <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)}
          className="border rounded px-2 py-1 w-full mb-2"
        />

        <input type="text" placeholder="Precio por Kg" value={precio} onChange={(e) => setPrecio(e.target.value)}
          className="border rounded px-2 py-1 w-full mb-2"
        />

        <div className="flex items-center gap-2 mb-2">
          {/* Selector de Categoría */}
          <select value={selectedCategory?.id || ""} onChange={(e) =>
              setSelectedCategory(categories.find((c) => c.id === Number(e.target.value)) || null)}
            className="border rounded px-2 py-1 w-full"
          >
            <option value="">Seleccione una categoría</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
          <button
            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
            onClick={() => navigate("/categorias")}
          >
            <FaPlus />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          {/* Selector de Proveedor */}
          <select value={selectedProvider?.id || ""} onChange={(e) =>
              setSelectedProvider(providers.find((p) => p.id === Number(e.target.value)) || null)}
            className="border rounded px-2 py-1 w-full"
          >
            <option value="">Seleccione un proveedor</option>
            {providers.map((prov) => (
              <option key={prov.id} value={prov.id}>{prov.nombre}</option>
            ))}
          </select>
          <button
            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
            onClick={() => navigate("/proveedores")}
          >
            <FaPlus />
          </button>
        </div>

        <button className="bg-orange-500 text-white px-4 py-2 rounded" onClick={handleAddProduct}>
          Añadir Producto
        </button>
      </div>

      {/* Tabla de productos */}
      <table className="w-full border-collapse border border-gray-300 text-center">
        <thead>
          <tr className="bg-gray-200">
            <th>Nombre</th>
            <th>Precio por Kg</th>
            <th>Categoría</th>
            <th>Proveedor</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.nombre}</td>
              <td>${product.precio_kilo.toFixed(2)}</td>
              <td>{categories.find((cat) => cat.id === product.categoria)?.nombre || "N/A"}</td>
              <td>{providers.find((prov) => prov.id === product.proveedor)?.nombre || "N/A"}</td>
              <td className="flex justify-center items-center gap-4">
                <button className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600"
                  onClick={() => handleEditProduct(product.id)}
                >
                  <FaEdit />
                </button>
                <button className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  onClick={() => handleDeleteProductRequest(product.id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Notificación de validación */}
      <NotificacionValidacion onConfirmSave={() => {}} onConfirmDelete={handleConfirmDelete} />
    </div>
  );
};

export default ProductList;









