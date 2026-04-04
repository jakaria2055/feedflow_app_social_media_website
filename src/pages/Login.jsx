import React, { useEffect, useState } from "react";
import login_logo from "/image/login_page_logo.png";
import AuthForm from "../components/AuthForm";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../redux/slices/userSlices.js";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [searchParams] = useSearchParams();
  const [view, setView] = useState("login");
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    newPassword: "",
  });

  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setView("resetPassword");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};

    if (view === "login") {
      if (!formData.email) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Email is invalid";
      if (!formData.password) newErrors.password = "Password is required";
    }

    if (view === "register") {
      if (!formData.username) newErrors.username = "Username is required";
      if (!formData.email) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Email is invalid";
      if (!formData.password) newErrors.password = "Password is required";
      else if (formData.password.length < 6)
        newErrors.password = "Password must be at least 6 characters";
      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }

    if (view === "forgotPassword") {
      if (!formData.email) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Email is invalid";
    }

    if (view === "resetPassword") {
      if (!formData.newPassword)
        newErrors.newPassword = "New password is required";
      else if (formData.newPassword.length < 6)
        newErrors.newPassword = "Password must be at least 6 characters";
      if (formData.newPassword !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) return;

    console.log("Form Submitted:", { view, formData });

    if (view === "register") {
      dispatch(
        registerUser(
          {
            username: formData.username,
            email: formData.email,
            password: formData.password,
          }
        ),
      );
    } else if (view === "login") {
      dispatch(
        loginUser(
          {
            email: formData.email,
            password: formData.password,
          },
        ),
      );
    } else if (view === "forgotPassword") {
      console.log("forgotPassword");
    } else if (view === "resetPassword") {
      console.log("resetPassword");
    }

    // CLEAR FORM
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      newPassword: "",
    });
  };

  const switchView = (newView) => {
    setView(newView);
    setErrors({});
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      newPassword: "",
    });
  };

  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center p-4 sm:p-6 font-sans">
      {/* Simple Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-pink-900/30 to-orange-800/30"></div>

      <div className="relative w-full max-w-4xl backdrop-blur-xl bg-white/5 rounded-2xl shadow-2xl overflow-hidden border border-white/10">
        <div className="flex flex-col md:flex-row">
          {/* LEFT SIDE - Brand Section */}
          <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-purple-900/40 via-pink-900/40 to-orange-800/40 p-8 items-center justify-center">
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-28 h-28 mb-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 p-1 shadow-xl">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                  <img
                    src={login_logo}
                    alt="logo"
                    className="w-16 h-16 object-contain"
                  />
                </div>
              </div>

              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent mb-3">
                FeedFlow
              </h1>

              <p className="text-gray-300 text-base leading-relaxed">
                Connect, share, and discover amazing content with people from
                around the world
              </p>

              {/* Simple Feature List */}
              <div className="mt-6 space-y-2 text-left w-full">
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-500"></div>
                  <span>Share photos & videos</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                  <span>Create engaging reels</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                  <span>Connect with friends</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Auth Form */}
          <div className="w-full md:w-1/2 p-6 md:p-8">
            <AuthForm
              view={view}
              formData={formData}
              errors={errors}
              token={token}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              switchView={switchView}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
