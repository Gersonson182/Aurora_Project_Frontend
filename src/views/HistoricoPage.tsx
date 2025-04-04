import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HistoricoDietas from "../features/recipes/historico_dietas";
import HistoricoProducto from "../features/productos/historico_producto"; 

const HistoricoPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  //  Obtener la vista actual desde la URL
  const selectedView = location.pathname.includes("/historico/producto") ? "productos" : "dietas";

  useEffect(() => {
    if (location.pathname !== "/historico/dieta" && location.pathname !== "/historico/producto") {
      navigate("/historico/dieta", { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className="p-6">
      {/* Mini Header con Botones de Navegación */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Historicos</h1>

        <div className="flex space-x-4">
          <button
            onClick={() => navigate("/historico/dieta",{replace: true})}
            className={`px-4 py-2 rounded ${
              selectedView === "dietas"
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Dietas
          </button>
          <button
            onClick={() => navigate("/historico/producto",{replace: true})}
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

      {/* Renderizar Historico Producto o Historico Dietas según la URL */}
      <div>
        {selectedView === "dietas" ? <HistoricoDietas /> : <HistoricoProducto />}
      </div>
    </div>
  );
};

export default HistoricoPage;