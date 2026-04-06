import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlices";
import storiesSlice from "./slices/storiesSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    stories: storiesSlice,
  },
});

export default store;
