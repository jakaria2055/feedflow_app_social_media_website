import { createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios.js";
import toast from "react-hot-toast";
import { connectSocket, disconnectSocket } from "../../lib/socket.js";

// Initial State
const initialState = {
  user: null, // Stores logged-in user data
  profileUser: null,
  suggestedUsers: [],
  loading: false, // Tracks API request status
  error: null, // Stores error messages
  isAuthenticated: false,
  isCheckingAuth: true,
  followers: [],
  onlineUsers: [],
  following: [],
  notification: [],
  socket: null,
};

// Slice Definition
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Set loading state (true/false)
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setCheckingAuth: (state, action) => {
      state.isCheckingAuth = action.payload;
    },

    setSocket: (state, action) => {
      state.socket = action.payload;
    },

    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },

    // Set user data and authentication status
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload; // true if user exists, false if null
      state.error = null; // clear error when user is successfully set
    },

    setProfileUser: (state, action) => {
      state.profileUser = action.payload;
      state.isAuthenticated = true;
    },

    setSuggestedUser: (state, action) => {
      state.suggestedUsers = action.payload;
    },

    updateFollowers: (state, action) => {
      if (state.profileUser) state.profileUser.followers = action.payload;
    },

    updateFollowing: (state, action) => {
      if (state.profileUser) state.profileUser.following = action.payload;
    },
    setFollowers: (state, action) => {
      state.followers = action.payload;
      state.error = null;
    },
    setFollowing: (state, action) => {
      state.following = action.payload;
      state.error = null;
    },

    setNotification: (state, action) => {
      const { type, userId, postId, targetUserId } = action.payload;

      // REMOVE LIKE
      if (type === "unlike") {
        state.notification = state.notification.filter(
          (notify) =>
            !(
              notify.type === "like" &&
              notify.userId?.toString() === userId?.toString() &&
              notify.postId?.toString() === postId?.toString()
            ),
        );
        return;
      }

      // REMOVE FOLLOW
      if (type === "unfollow") {
        state.notification = state.notification.filter(
          (notify) =>
            !(
              notify.type === "follow" &&
              notify.userId?.toString() === userId?.toString() &&
              notify.targetUserId?.toString() === targetUserId?.toString()
            ),
        );
        return;
      }

      // REMOVE DUPLICATES
      if (type === "like") {
        state.notification = state.notification.filter(
          (notify) =>
            !(
              notify.type === "like" &&
              notify.userId?.toString() === userId?.toString() &&
              notify.postId?.toString() === postId?.toString()
            ),
        );
      }

      if (type === "follow") {
        state.notification = state.notification.filter(
          (notify) =>
            !(
              notify.type === "follow" &&
              notify.userId?.toString() === userId?.toString() &&
              notify.targetUserId?.toString() === targetUserId?.toString()
            ),
        );
      }

      if (type === "comment") {
        state.notification = state.notification.filter(
          (notify) =>
            !(
              notify.type === "comment" &&
              notify.userId?.toString() === userId?.toString() &&
              notify.postId?.toString() === postId?.toString()
            ),
        );
      }

      state.notification.unshift(action.payload);
    },

    // Set error message and reset authentication
    setError: (state, action) => {
      state.error = action.payload;
      state.isAuthenticated = false;
    },

    // Set user saved post data
    setSavedPosts: (state, action) => {
      if (state.user) state.user.savedPosts = action.payload;
    },

    // Clear user data on logout
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
});

// Export actions
export const {
  setLoading,
  setCheckingAuth,
  setSocket,
  setOnlineUsers,
  setUser,
  setSavedPosts,
  setProfileUser,
  updateFollowers,
  updateFollowing,
  setFollowers,
  setFollowing,
  setNotification,
  setError,
  setSuggestedUser,
  logout,
} = userSlice.actions;
// Export reducer
export default userSlice.reducer;

const setupSocketConnection = (userId, dispatch) => {
  const socket = connectSocket(userId);
  dispatch(setSocket(socket));

  socket.on("getOnlineUsers", (userIds) => {
    dispatch(setOnlineUsers(userIds));
  });

  socket.on("notification", (notification) => {
    dispatch(setNotification(notification));
  });

  socket.on("connect_error", (error) => {
    console.log("Error: Socket connection error: ", error);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket Disconnect: ", reason);
    if (reason === "io server disconnect") {
      socket.connect();
    }
  });
};

const cleanupSocketConnection = (socket, dispatch) => {
  if (socket) {
    socket.off("getOnlineUsers");
    socket.off("notification");
    socket.off("connect_error");
    socket.off("disconnect");
    disconnectSocket();
    dispatch(setSocket(null));
  }
};

// ==============================
// Async Thunks (API Calls)
// ==============================

// Register new user
export const registerUser = (userData, navigate) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const { data } = await axiosInstance.post("/user/register", userData);
    if (data?.success) {
      dispatch(setUser(data?.user));
      toast.success(data.message || "Register success.");
      // const socket = connectSocket(data?.user?._id);
      // dispatch(setSocket(socket));
      setupSocketConnection(data?.user?._id, dispatch);
      navigate("/login");
    }
  } catch (error) {
    dispatch(setError(error?.response?.data?.message || "Register Failed"));
    // toast.error(error?.response?.data?.message || "Register Failed");
  } finally {
    dispatch(setLoading(false));
  }
};

// Login user
export const loginUser = (userData, navigate) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const { data } = await axiosInstance.post("/user/login", userData);
    if (data?.success) {
      dispatch(setUser(data?.user));
      toast.success(data.message || "Login success.");
      // const socket = connectSocket(data?.user?._id);
      // dispatch(setSocket(socket));
      setupSocketConnection(data?.user?._id, dispatch);
      navigate("/");
    }
  } catch (error) {
    dispatch(setError(error?.response?.data?.message || "Login Failed"));
    // toast.error(error?.response?.data?.message || "Login Failed");
  } finally {
    dispatch(setLoading(false));
  }
};

// Get current logged-in user profile
export const getCurrentUser = () => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setCheckingAuth(true));
  try {
    const { data } = await axiosInstance.get("/user/profile");
    if (data?.success) {
      dispatch(setUser(data?.user));
      // const socket = connectSocket(data?.user?._id);
      // dispatch(setSocket(socket));
      setupSocketConnection(data?.user?._id, dispatch);
    }
  } catch (error) {
    dispatch(setError(error?.response?.data?.message || "Profile Failed"));
  } finally {
    dispatch(setCheckingAuth(false));
    dispatch(setLoading(false));
  }
};

// Logout user
export const logoutUser = (navigate) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  try {
    const { data } = await axiosInstance.get("/user/logout");
    // if (data?.success) {
    dispatch(logout());
    toast.success(data.message || "Logout success.");
    const { socket } = getState().user;
    cleanupSocketConnection(socket, dispatch);
    navigate("/");
    // }
  } catch (error) {
    dispatch(setError(error?.response?.data?.message || "Logout Failed"));
    // toast.error(error?.response?.data?.message || "Logout Failed");
  } finally {
    dispatch(setLoading(false));
  }
};

// Update profile image
export const updateProfileImage = (formData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const { data } = await axiosInstance.post("/user/upload-profile", formData);
    if (data?.success) {
      dispatch(setUser(data?.user));
      toast.success(data.message || "Profile Image Uploaded Successfully.");
    }
  } catch (error) {
    dispatch(
      setError(error?.response?.data?.message || "Profile Image Upload Failed"),
    );
    toast.error(
      error?.response?.data?.message || "Profile Image Upload Failed",
    );
  } finally {
    dispatch(setLoading(false));
  }
};

// Update user profile details
export const updateProfileUser = (userData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const { data } = await axiosInstance.put("/user/update-profile", userData);
    if (data?.success) {
      dispatch(setUser(data?.user));
      toast.success(data.message || "Profile Updated Successfully.");
    }
  } catch (error) {
    dispatch(
      setError(error?.response?.data?.message || "Profile Update Failed"),
    );
    toast.error(error?.response?.data?.message || "Profile Update Failed");
  } finally {
    dispatch(setLoading(false));
  }
};

//Get User By Id
export const getUserById = (id) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const { data } = await axiosInstance.get(`/user/${id}`);
    if (data?.success) {
      dispatch(setProfileUser(data?.user));
    }
  } catch (error) {
    dispatch(
      setError(error?.response?.data?.message || "Get Profile By Id  Failed."),
    );
    toast.error(error?.response?.data?.message || "Get Profile By Id  Failed.");
  } finally {
    dispatch(setLoading(false));
  }
};

//Follow User
export const followUserAction =
  (targetUserId) => async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      const { data } = await axiosInstance.post(`/user/follow`, {
        targetId: targetUserId,
      });
      if (data?.success) {
        toast.success(data?.message || "Followed Successfully");
        const state = getState();
        const currentUser = state.user.user; //  Fix: was state.user (missing .user)

        if (currentUser && !currentUser.following.includes(targetUserId)) {
          dispatch(
            setUser({
              ...currentUser,
              following: [...currentUser.following, targetUserId], //  Fix: was state.user
            }),
          );
        }

        //  Fix: was state.profileUser (missing .user), and state.updateProfileUser typo
        const profileUser = state.user.profileUser;
        if (profileUser && profileUser._id !== currentUser?._id) {
          dispatch(
            setProfileUser({
              ...profileUser,
              followers: [...profileUser.followers, currentUser._id], //  target gets a new follower
            }),
          );
        }
      }
    } catch (error) {
      dispatch(
        setError(error?.response?.data?.message || "Failed to follow user."),
      );
      toast.error(error?.response?.data?.message || "Failed to follow user.");
    } finally {
      dispatch(setLoading(false));
    }
  };

//UnFollow User
export const unfollowUserAction =
  (targetUserId) => async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      const { data } = await axiosInstance.post(`/user/unfollow`, {
        targetId: targetUserId,
      });
      if (data?.success) {
        toast.success(data?.message || "UnFollowed Successfully");
        const state = getState();
        const currentUser = state.user.user; // ✅ Fix: was state.user (missing .user)

        // ✅ Fix: condition was wrong — was checking !includes but should filter when IS following
        if (currentUser) {
          dispatch(
            setUser({
              ...currentUser,
              following: currentUser.following.filter(
                (id) => id.toString() !== targetUserId.toString(),
              ),
            }),
          );
        }

        // ✅ Fix: was state.profileUser (missing .user)
        const profileUser = state.user.profileUser;
        if (profileUser && profileUser._id !== currentUser?._id) {
          dispatch(
            setProfileUser({
              ...profileUser,
              followers: profileUser.followers.filter(
                (id) => id.toString() !== currentUser._id.toString(),
              ),
            }),
          );
        }
      }
    } catch (error) {
      dispatch(
        setError(error?.response?.data?.message || "Failed to unfollow user."),
      );
      toast.error(error?.response?.data?.message || "Failed to unfollow user.");
    } finally {
      dispatch(setLoading(false));
    }
  };

//Get Followers
export const fetchFollowers = (userId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const { data } = await axiosInstance.get(`/user/${userId}/followers`);
    if (data?.success) {
      dispatch(setFollowers(data?.followers));
      dispatch(updateFollowers(data?.followers));
    }
  } catch (error) {
    dispatch(
      setError(error?.response?.data?.message || "Get Followers Failed."),
    );
    toast.error(error?.response?.data?.message || "Get Followers Failed.");
  } finally {
    dispatch(setLoading(false));
  }
};

//Fetch Following
export const fetchFollowing = (userId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const { data } = await axiosInstance.get(`/user/${userId}/following`);
    if (data?.success) {
      dispatch(setFollowing(data?.following));
      dispatch(updateFollowing(data?.following));
    }
  } catch (error) {
    dispatch(
      setError(error?.response?.data?.message || "Get Following  Failed."),
    );
    toast.error(error?.response?.data?.message || "Get Following Failed.");
  } finally {
    dispatch(setLoading(false));
  }
};

//Get Suggested User
export const fetchSuggestedUsers = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const { data } = await axiosInstance.get(`/user/suggested/users`);
    if (data?.success) {
      dispatch(setSuggestedUser(data?.users));
    }
  } catch (error) {
    dispatch(
      setError(error?.response?.data?.message || "Get Suggested User Failed."),
    );
    toast.error(error?.response?.data?.message || "Get Suggested User Failed.");
  } finally {
    dispatch(setLoading(false));
  }
};
