import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlices";
import storiesSlice from "./slices/storiesSlice";
import postSlice from "./slices/postSlice";
import reelSlice  from "./slices/reelSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    stories: storiesSlice,
    posts: postSlice,
    reels: reelSlice,
  },
});

export default store;
