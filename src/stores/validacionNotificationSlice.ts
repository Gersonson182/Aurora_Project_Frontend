import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ✅ Definir tipos específicos para evitar valores arbitrarios
export type ValidationActionType = "update" | "delete" | "restore"; 

interface ValidationNotificationState {
  isVisible: boolean;
  message: string;
  actionType: ValidationActionType | null; // ✅ Solo acepta tipos válidos
}

const initialState: ValidationNotificationState = {
  isVisible: false,
  message: "",
  actionType: null,
};

const validationNotificationSlice = createSlice({
  name: "validationNotification",
  initialState,
  reducers: {
    showValidationNotification: (
      state,
      action: PayloadAction<{ message: string; actionType: ValidationActionType }>
    ) => {
      state.isVisible = true;
      state.message = action.payload.message;
      state.actionType = action.payload.actionType;
    },
    hideValidationNotification: (state) => {
      state.isVisible = false;
      state.message = "";
      state.actionType = null;
    },
  },
});

export const { showValidationNotification, hideValidationNotification } =
  validationNotificationSlice.actions;

export default validationNotificationSlice.reducer;


