import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { fetchProductsThunk, updateProductThunk } from "./productoSlice";
import { showNotification } from "../../stores/notificationsSlice";
import { showValidationNotification } from "../../stores/validacionNotificationSlice";
import { Product } from "../../types";
import NotificacionValidacion from "../../components/ValidacionNotification";

const EditarProduct = () => {
  const { id } = useParams<{ id: string }>();
  const productId = id ? parseInt(id, 10) : null; 
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { products } = useAppSelector((state) => state.productoSlice);
  const { categories } = useAppSelector((state) => state.categoriaSlice);
  const { providers } = useAppSelector((state) => state.proveedorSlice);

  // Estado local para el formulario
  const [productData, setProductData] = useState<Partial<Product>>({
    nombre: "",
    precio_kilo: 0,
    categoria: null,
    proveedor: null,
  });

  // Estado para manejar la confirmación de edición
  const [pendingSave, setPendingSave] = useState(false);

  // Cargar productos si aún no están en el store
  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProductsThunk());
    }
  }, [dispatch, products.length]);

  // Cargar datos del producto cuando `products` esté disponible
  useEffect(() => {
    if (productId) {
      const product = products.find((p) => p.id === productId);
      if (product) {
        setProductData({ ...product }); // ✅ Clonar objeto para evitar modificar el estado global
      }
    }
  }, [products, productId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: name === "precio_kilo" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSaveRequest = () => {
    if (!productId) {
      dispatch(showNotification({ message: "ID de producto inválido.", type: "error" }));
      return;
    }

    if (!productData.nombre?.trim()) {
      dispatch(showNotification({ message: "El campo 'Nombre' no puede estar vacío.", type: "error" }));
      return;
    }

    if (!productData.precio_kilo || isNaN(Number(productData.precio_kilo)) || Number(productData.precio_kilo) <= 0) {
      dispatch(showNotification({ message: "El campo 'Precio por Kg' debe ser un número positivo.", type: "error" }));
      return;
    }

    // ✅ Activar la notificación de confirmación antes de guardar
    setPendingSave(true);
    dispatch(
      showValidationNotification({
        message: "¿Está seguro de que desea modificar este producto?",
        actionType: "update",
      })
    );
  };

  const handleConfirmSave = async () => {
    if (!productId) return;

    try {
      await dispatch(updateProductThunk({ id: productId, ...productData })).unwrap();
      dispatch(showNotification({ message: "Producto actualizado correctamente.", type: "success" }));
      navigate("/insumos/productos");
    } catch (error) {
      dispatch(showNotification({ message: "Error al actualizar producto.", type: "error" }));
    } finally {
      setPendingSave(false);
    }
  };

  const handleCancel = () => {
    navigate("/insumos/productos"); // ✅ Vuelve a la lista de productos
  };

  return (
    <div className="p-6">
      <h4 className="text-xl font-bold mb-4">Editar Producto</h4>

      <input
        type="text"
        name="nombre"
        placeholder="Nombre"
        value={productData.nombre || ""}
        onChange={handleInputChange}
        className="border rounded px-2 py-1 w-full mb-2"
      />

      <input
        type="number"
        name="precio_kilo"
        placeholder="Precio por Kg"
        value={productData.precio_kilo || ""}
        onChange={handleInputChange}
        className="border rounded px-2 py-1 w-full mb-2"
      />

      <select
        name="categoria"
        value={productData.categoria || ""}
        onChange={handleInputChange}
        className="border rounded px-2 py-1 w-full mb-2"
      >
        <option value="">Seleccione una categoría</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.nombre}</option>
        ))}
      </select>

      <select
        name="proveedor"
        value={productData.proveedor || ""}
        onChange={handleInputChange}
        className="border rounded px-2 py-1 w-full mb-4"
      >
        <option value="">Seleccione un proveedor</option>
        {providers.map((prov) => (
          <option key={prov.id} value={prov.id}>{prov.nombre}</option>
        ))}
      </select>

      <div className="flex gap-4">
        <button className="bg-orange-500 text-white px-4 py-2 rounded" onClick={handleSaveRequest}>
          Guardar
        </button>
        <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={handleCancel}>
          Cancelar
        </button>
      </div>

      {/* Notificación de validación */}
      {pendingSave && (
        <NotificacionValidacion
          onConfirmSave={handleConfirmSave} // ✅ Se ejecuta si confirma la edición
          onConfirmDelete={() => {}} // No se usa en este caso
        />
      )}
    </div>
  );
};

export default EditarProduct;



