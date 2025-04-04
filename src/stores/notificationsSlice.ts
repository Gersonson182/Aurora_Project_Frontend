import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotificationType } from "../types";

type NotificationState = {
    notification: NotificationType | null;
};

const initialState: NotificationState = {
    notification: null,
};

const notificationsSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        showNotification(state, action: PayloadAction<NotificationType>) {
            state.notification = action.payload;
            
        },
        hideNotification(state) {
            state.notification = null;
        },
    },
});

export const { showNotification, hideNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;
