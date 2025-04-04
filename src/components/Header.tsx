import { useAppDispatch } from "../stores/hooks";
import { logoutThunk } from "../features/auth/authSlice";

interface HeaderProps {
  user: {
    rut: string;
    email: string;
    role: string;
  } | null;
}

export const Header = ({ user }: HeaderProps) => {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logoutThunk());
  };

  return (
    <header className="bg-orange-500 text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-extrabold tracking-wide">Panel de control</h1>
      <div className="flex items-center space-x-4">
        {/*Muestra el nombre o el RUT del usuario autenticado */}
        <span className="font-medium">
          {user ? `${user.email || user.rut} (${user.role})` : "Cargando..."}
        </span>
        <button
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm font-semibold transition"
          onClick={handleLogout}
        >
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
};
