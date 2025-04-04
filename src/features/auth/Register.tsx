import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerThunk } from "./authSlice";
import { RootState } from "../../stores/store";
import { Navigate } from "react-router-dom";

const Register = () => {
  const [rut, setRut] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  
  const { loading, error } = useSelector((state: RootState) => state.authSlice);

  const handleRegister = () => {
    dispatch(registerThunk({ rut, email, password }) as any);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6">Registrarse</h2>
        <input
          type="text"
          placeholder="RUT"
          value={rut}
          onChange={(e) => setRut(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-4"
        />
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-4"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-4"
        />
        <button
          onClick={handleRegister}
          className="w-full bg-green-500 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? "Cargando..." : "Registrarse"}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default Register;
