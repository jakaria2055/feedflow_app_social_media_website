import { createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios.js";
import { getSocket } from "../../lib/socket.js";

// Initial State
const initialState = {
  messages: [],
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
};

// Slice Definition
export const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
      if (action.payload) state.error = null; // clear error on new request
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setAllUsersForMessages: (state, action) => {
      state.users = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

// Export actions
export const {
  setLoading,
  addMessage,
  setMessages,
  setAllUsersForMessages,
  setSelectedUser,
  setError,
} = messageSlice.actions;

export default messageSlice.reducer;

// ==============================
// Async Thunks (API Calls)
// ==============================

// Send Message
export const sendMessage = (formData) => async (dispatch, getState) => {
  console.log("Form Data: ", formData);
  dispatch(setLoading(true));
  const { selectedUser } = getState().messages;
  if (!selectedUser) {
    dispatch(setError("No user selected"));
    dispatch(setLoading(false));
    return;
  }

  try {
    const { data } = await axiosInstance.post(
      `/messages/send/${selectedUser._id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    if (data?.success) {
      dispatch(addMessage(data.data));
    }
  } catch (error) {
    dispatch(
      setError(error?.response?.data?.message || "Sending Message Failed"),
    );
  } finally {
    dispatch(setLoading(false));
  }
};

// Get Messages
export const getAllMessages = (receiverId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const { data } = await axiosInstance.get(`/messages/${receiverId}`);
    if (data?.success) {
      dispatch(setMessages(data.data));
    }
  } catch (error) {
    dispatch(setError(error?.response?.data?.message || "Get Message Failed"));
  } finally {
    dispatch(setLoading(false));
  }
};

// Get Users for Messaging
export const getAllUsersForMessage = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const { data } = await axiosInstance.get(`/messages/users`);
    if (data?.success) {
      dispatch(setAllUsersForMessages(data.data));
    }
  } catch (error) {
    dispatch(
      setError(error?.response?.data?.message || "Get Message User Failed"),
    );
  } finally {
    dispatch(setLoading(false));
  }
};

//Subscribe to message from he selected user
export const subscribeMessages = () => async (dispatch, getState) => {
  const { selectedUser } = getState().messages;
  if (!selectedUser) return;
  const socket = getSocket();
  if (!socket) return;
  socket.on("newMessage", (newMessage) => {
    if (newMessage.senderId !== selectedUser?._id) return;
    dispatch(addMessage(newMessage));
  });
};

//UnSubscribe from newMessage
export const unSubscribeMessages = () => async () => {
  const socket = getSocket();
  if (!socket) return;
  socket.off("newMessage");
};
