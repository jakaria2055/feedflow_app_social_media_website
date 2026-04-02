import { createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios.js";
import toast from "react-hot-toast";

const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setLoading, setUser, setError } = userSlice.actions;

export default userSlice.reducer;

//FETCH API
const registerUser = (userData, navigate) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const { data } = await axiosInstance.post("/user/register", userData);
    if (data?.success) {
      setUser(data?.user);
      toast.success(data.message || "Register success.");
      navigate("/");
    }
  } catch (error) {
    dispatch(setError(error?.response?.data?.message || "Register Failed"));
    toast.error(error?.response?.data?.message || "register Failed");
  } finally {
    dispatch(setLoading(false));
  }
};
