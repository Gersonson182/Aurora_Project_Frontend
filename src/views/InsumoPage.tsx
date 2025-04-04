import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import RecipeList from "../features/recipes/RecipeList";
import ProductList from "../features/productos/ProductList"; // 
const InsumoPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  //  Obtener la vista actual desde la URL
  const selectedView = location.pathname.includes("productos") ? "productos" : "dietas";

  useEffect(() => {
    // Si no hay una ruta válida, redirigir a recetas por defecto
    if (!["/insumos/dieta", "/insumos/productos"].includes(location.pathname)) {
      navigate("/insumos/dieta");
    }
  }, [location.pathname, navigate]);

  return (
    <div className="p-6">
      {/* Mini Header con Botones de Navegación */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Insumos</h1>

        <div className="flex space-x-4">
          <button
            onClick={() => navigate("/insumos/recetas")}
            className={`px-4 py-2 rounded ${
              selectedView === "dietas"
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Dietas
          </button>
          <button
            onClick={() => navigate("/insumos/productos")}
            className={`px-4 py-2 rounded ${
              selectedView === "productos"
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Productos
          </button>
        </div>
      </div>

      {/* ✅ Renderizar ProductList o RecipeList según la URL */}
      <div>
        {selectedView === "dietas" ? <RecipeList /> : <ProductList />}
      </div>
    </div>
  );
};

export default InsumoPage;


