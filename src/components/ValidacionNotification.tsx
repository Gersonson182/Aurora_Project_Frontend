import { useAppDispatch, useAppSelector } from "../stores/hooks";
import { hideValidationNotification } from "../stores/validacionNotificationSlice";

interface NotificacionValidacionProps {
  
  onConfirmSave: () => void;
  onConfirmDelete: () => void;
}

const NotificacionValidacion = ({ onConfirmSave, onConfirmDelete }: NotificacionValidacionProps) => {
  const dispatch = useAppDispatch();
  const { isVisible, message, actionType } = useAppSelector((state) => state.validationNotification);

  if (!isVisible) return null;

  const handleConfirm = () => {
    if (actionType === "update") {
      onConfirmSave();  // ✅ Si es actualización, ejecuta la acción de guardar
    } else if (actionType === "delete") {
      onConfirmDelete(); // ✅ Si es eliminación, ejecuta la acción de eliminar
    }
    dispatch(hideValidationNotification()); // ✅ Ocultar la notificación después de confirmar
  };

  const handleCancel = () => {
    dispatch(hideValidationNotification()); // ✅ Solo cierra el modal sin realizar ninguna acción
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-30 backdrop-blur-md">
      <div className="bg-white p-6 rounded shadow-md">
        <p className="mb-4">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificacionValidacion;




