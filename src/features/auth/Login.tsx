import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Requiere react-router-dom
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { loginThunk } from "./authSlice";

const Login = () => {
  const navigate = useNavigate(); //  Inicializar la navegación
  const dispatch = useAppDispatch();
  const { isAuthenticated, error, loading } = useAppSelector((state) => state.authSlice);
  const [rut, setRut] = useState("");
  const [password, setPassword] = useState("");
  const loginButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    console.log("🔍 Estado de autenticación en Redux:", isAuthenticated);

    if (isAuthenticated) {
      console.log("✅ Usuario autenticado, redirigiendo a la página de insumos...");
      navigate("/insumos/dieta", { replace: true }); // ✅ Redirigir a TestPage
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    console.log("🔍 Intentando iniciar sesión con:", { rut, password });

    if (!loading) {
      await dispatch(loginThunk({ rut, password }));

      // ✅ Verifica si el token se almacena correctamente después del login
      setTimeout(() => {
        console.log("🔹 Token en LocalStorage después del login:", localStorage.getItem("access_token"));
      }, 500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && loginButtonRef.current) {
      loginButtonRef.current.click(); // Simula un clic en el botón "Ingresar"
    }
  };
  
  // Función para formatear el RUT sin bloquear correos
  const formatRut = (rut: string) => {
    // Limpiar el RUT dejando solo números y la letra K (mayúscula o minúscula)
    let cleanRut = rut.replace(/[^0-9kK]/g, "").toUpperCase();
    // Si el RUT tiene al menos 2 caracteres, aplicar el formato
    if (cleanRut.length > 1) {
      let rutBody = cleanRut.slice(0, -1); // Números del RUT
      let dv = cleanRut.slice(-1); // Dígito verificador (último carácter)
      //  Agregar los puntos cada 3 dígitos
      rutBody = rutBody.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      // Unir el cuerpo del RUT con el dígito verificador
      cleanRut = `${rutBody}-${dv}`;
    }
    return cleanRut;
  };
  
  
  
  

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6">Iniciar Sesión</h2>
        <input
          type="text"
          placeholder="RUT o Correo"
          value={rut}
          onChange={(e) => setRut(formatRut(e.target.value))} // ✅ Detección automática de RUT o Correo
          onKeyDown={handleKeyPress} 
          className="w-full px-3 py-2 border rounded mb-4"
        />

        <input
          type="password"
          onKeyDown={handleKeyPress} 
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-4"
        />
        <button
          ref={loginButtonRef}
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? "Cargando..." : "Ingresar"}
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default Login;












