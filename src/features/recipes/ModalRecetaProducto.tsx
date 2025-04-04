import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { fetchProductsThunk } from "../productos/productoSlice";
import { addProductToRecipeThunk, fetchRecipesThunk } from "./recipeSlice";
import { showNotification } from "../../stores/notificationsSlice";
import { Product } from "../../types";

interface ModalRecetaProductoProps {
  isOpen: boolean;
  onClose: () => void;
  etapaId: number;
}

const ModalRecetaProducto: React.FC<ModalRecetaProductoProps> = ({ isOpen, onClose, etapaId }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { products } = useAppSelector((state) => state.productoSlice);
  const { recipes, totals } = useAppSelector((state) => state.recipeSlice);

  // 🔹 Lista de productos seleccionados
  const [selectedProducts, setSelectedProducts] = useState<{ product: Product; percentage: string }[]>([]);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchProductsThunk());
      dispatch(fetchRecipesThunk());
    }
  }, [isOpen, dispatch]);

  const availableProducts: Product[] = products.filter(
    (product) => !recipes.some((recipe) => recipe.etapa_id === etapaId && recipe.producto === product.nombre)
  );

  const handleAddProduct = async () => {
    console.log("Iniciando handleAddProduct...");

    if (selectedProducts.length === 0) {
      dispatch(showNotification({ message: "Por favor selecciona al menos un producto", type: "error" }));
      return;
    }

    let totalNuevo = totals.totalPorcentaje;

    for (const { product, percentage } of selectedProducts) {
      const porcentajeFloat = parseFloat(percentage);
      if (isNaN(porcentajeFloat) || porcentajeFloat <= 0) {
        dispatch(showNotification({ message: `Porcentaje inválido para ${product.nombre}`, type: "error" }));
        return;
      }

      totalNuevo += porcentajeFloat;
    }

    if (totalNuevo > 100) {
      dispatch(showNotification({ message: "El total de porcentaje no puede superar el 100%", type: "error" }));
      return;
    }

    try {
      for (const { product, percentage } of selectedProducts) {
        await dispatch(
          addProductToRecipeThunk({
            productId: product.id,
            porcentaje: parseFloat(percentage),
            etapaId,
          })
        ).unwrap();
      }

      dispatch(showNotification({ message: "Productos añadidos correctamente", type: "success" }));

      await dispatch(fetchRecipesThunk());
      await dispatch(fetchProductsThunk());

      // 🔹 Reiniciar el estado del modal
      setSelectedProducts([]);

      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      dispatch(showNotification({ message: "Error al añadir productos", type: "error" }));
    }
  };

  const handleProductChange = (product: Product, percentage: string) => {
    setSelectedProducts((prev) => {
      const existingIndex = prev.findIndex((p) => p.product.id === product.id);

      if (existingIndex !== -1) {
        // Si el producto ya está en la lista, actualizamos su porcentaje
        const updatedProducts = [...prev];
        updatedProducts[existingIndex].percentage = percentage;
        return updatedProducts;
      } else {
        // Si es un nuevo producto, lo añadimos
        return [...prev, { product, percentage }];
      }
    });
  };

  const handleNavigateToProductPage = () => {
    navigate("/gestionar-productos", { state: { fromRecipe: true } });
  };

  return (
    isOpen && (
      <div className="modal-overlay fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center">
        <div className="modal-content bg-white p-6 rounded shadow-lg w-2/4 max-h-[90vh] overflow-y-auto">
          <h2 className="text-lg font-bold mb-4">Añadir Productos a la Receta</h2>
          <table className="table-auto w-full mb-4">
            <thead>
              <tr className="bg-orange-500">
                <th className="px-4 py-2 text-white">Producto</th>
                <th className="px-4 py-2 text-white">% a añadir</th>
              </tr>
            </thead>
            <tbody>
              {availableProducts.map((product) => (
                <tr key={product.id} className="border-t">
                  <td className="px-4 py-2">{product.nombre}</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={selectedProducts.find((p) => p.product.id === product.id)?.percentage || ""}
                      onChange={(e) => handleProductChange(product, e.target.value)}
                      className="border rounded px-2 py-1 w-full"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between mt-4">
            <button className="bg-orange-500 text-white px-4 py-2 rounded" onClick={handleAddProduct}>
              Añadir Productos
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={handleNavigateToProductPage}>
              ¿No encuentras el producto?
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ModalRecetaProducto;





