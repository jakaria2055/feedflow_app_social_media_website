import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCurrentUser } from "./redux/slices/userSlices.js";
import Market from "./pages/Market.jsx";
import Explore from "./pages/Explore.jsx";
import Reels from "./pages/Reels.jsx";
import Message from "./pages/Message.jsx";
import SuggestedUsersPage from "./pages/SuggestedUsersPage.jsx";
import AccountEdit from "./pages/AccountEdit.jsx";
import ProtectedRoute from "./protectedRoute/ProtectedRoute.jsx";

function App() {
  const dispatch = useDispatch();
  const { onlineUsers } = useSelector((state) => state.user);
  console.log("Online Active User: ", onlineUsers);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      ),
    },
    {
      path: "/explore",
      element: (
        <ProtectedRoute>
          <Explore />
        </ProtectedRoute>
      ),
    },
    {
      path: "/reels",
      element: (
        <ProtectedRoute>
          <Reels />
        </ProtectedRoute>
      ),
    },
    {
      path: "/chats",
      element: (
        <ProtectedRoute>
          <Message />
        </ProtectedRoute>
      ),
    },
    {
      path: "/market",
      element: (
        <ProtectedRoute>
          <Market />
        </ProtectedRoute>
      ),
    },
    {
      path: "/profile/:id",
      element: (
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      ),
    },
    {
      path: "/account/edit",
      element: (
        <ProtectedRoute>
          <AccountEdit />
        </ProtectedRoute>
      ),
    },

    {
      path: "/suggested-users",
      element: (
        <ProtectedRoute>
          <SuggestedUsersPage />
        </ProtectedRoute>
      ),
    },
    { path: "/login", element: <Login /> },
  ]);
  return <RouterProvider router={router} />;
}

export default App;

// 7: 30
