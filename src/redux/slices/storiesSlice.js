import { createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios.js";

// Initial State
const initialState = {
  stories: [],
  loading: false, // Tracks API request status
  error: null, // Stores error messages
};

// Slice Definition
export const storiesSlice = createSlice({
  name: "stories",
  initialState,
  reducers: {
    // Set loading state (true/false)
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Set user data and authentication status
    setStories: (state, action) => {
      state.stories = action.payload;
    },

    updateLikeStory: (state, action) => {
      const { storyId, userId } = action.payload;
      state.stories = state.stories.map((group) => ({
        ...group,
        stories: group.stories.map((story) => {
          if (story?._id === storyId) {
            const isLiked = story.likes.includes(userId);
            return {
              ...story,
              likes: isLiked
                ? story.likes.filter((id) => id !== userId)
                : [...story.likes, userId],
            };
          }
          return story;
        }),
      }));
    },

    // Set error message and reset authentication
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

// Export actions
export const { setLoading, setStories, setError, updateLikeStory  } = storiesSlice.actions;
// Export reducer
export default storiesSlice.reducer;

// ==============================
// Async Thunks (API Calls)
// ==============================

// Get current logged-in user profile
export const getAllStories = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const { data } = await axiosInstance.get("/story/all");
    if (data?.success) {
      dispatch(setStories(data?.stories));
    }
  } catch (error) {
    dispatch(setError(error?.response?.data?.message || "Stories Failed"));
  } finally {
    dispatch(setLoading(false));
  }
};
