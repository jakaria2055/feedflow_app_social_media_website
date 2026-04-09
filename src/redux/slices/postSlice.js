import { createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios.js";


// Initial State
const initialState = {
  posts: [],         
  loading: false,        // Tracks API request status
  error: null,           // Stores error messages

};

// Slice Definition
export const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // Set loading state (true/false)
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Set user data and authentication status
    setPosts: (state, action) => {
      state.posts = action.payload;
    },

    // Set error message and reset authentication
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

// Export actions
export const { setLoading, setPosts, setError } = postSlice.actions;
// Export reducer
export default postSlice.reducer;




// ==============================
// Async Thunks (API Calls)
// ==============================


// Get current logged-in user profile
export const getAllPosts = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const { data } = await axiosInstance.get("/post/all");
    if (data?.success) {
      dispatch(setPosts(data?.posts));
    }
  } catch (error) {
    dispatch(setError(error?.response?.data?.message || "Post fetch Failed"));
  } finally {
    dispatch(setLoading(false));
  }
};









