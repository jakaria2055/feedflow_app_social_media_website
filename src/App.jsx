import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getCurrentUser } from "./redux/slices/userSlices.js";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/profile", element: <Profile /> },
    { path: "/login", element: <Login /> },
  ]);
  return <RouterProvider router={router} />;
}

export default App;

// 6: 52
