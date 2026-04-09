import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlices";
import storiesSlice from "./slices/storiesSlice";
import postSlice from "./slices/postSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    stories: storiesSlice,
    posts: postSlice,
  },
});

export default store;
