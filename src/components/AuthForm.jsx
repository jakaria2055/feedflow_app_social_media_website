import React, { useState } from "react";
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";

const AuthForm = ({
  view,
  formData,
  errors,
  token,
  handleChange,
  handleSubmit,
  switchView,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const renderLoginForm = () => {
    return (
      <>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] bg-clip-text text-transparent mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-400">Sign in to continue your journey</p>
        </div>

        {/* EMAIL */}
        <div className="mb-5">
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Email Address
          </label>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 group-focus-within:text-[#E1306C] transition-colors">
              <Mail size={18} />
            </span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 text-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E1306C] focus:border-transparent transition-all duration-300 ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-700 hover:border-gray-600"
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle size={12} /> {errors.email}
            </p>
          )}
        </div>

        {/* PASSWORD */}
        <div className="mb-3">
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Password
          </label>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 group-focus-within:text-[#E1306C] transition-colors">
              <Lock size={18} />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={`w-full pl-10 pr-12 py-3 bg-gray-800/50 text-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E1306C] focus:border-transparent transition-all duration-300 ${
                errors.password
                  ? "border-red-500"
                  : "border-gray-700 hover:border-gray-600"
              }`}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-300 transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle size={12} /> {errors.password}
            </p>
          )}
        </div>

        <div className="flex justify-end mb-6">
          <button
            type="button"
            onClick={() => switchView("forgotPassword")}
            className="text-sm text-[#E1306C] hover:text-[#F77737] font-medium transition-colors duration-300 hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          className="relative w-full bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] text-white font-semibold py-3 px-4 rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#E1306C] focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg"
        >
          <span className="flex items-center justify-center gap-2">
            Login <ArrowRight size={18} />
          </span>
        </button>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => switchView("register")}
              className="text-[#E1306C] hover:text-[#F77737] font-semibold transition-colors duration-300 hover:underline"
            >
              Register
            </button>
          </p>
        </div>
      </>
    );
  };

  const renderRegisterForm = () => {
    return (
      <>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] bg-clip-text text-transparent mb-2">
            Create Account
          </h2>
          <p className="text-gray-400">Join our community today</p>
        </div>

        {/* USERNAME */}
        <div className="mb-5">
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Username
          </label>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 group-focus-within:text-[#E1306C] transition-colors">
              <User size={18} />
            </span>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 text-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E1306C] focus:border-transparent transition-all duration-300 ${
                errors.username
                  ? "border-red-500"
                  : "border-gray-700 hover:border-gray-600"
              }`}
            />
          </div>
          {errors.username && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle size={12} /> {errors.username}
            </p>
          )}
        </div>

        {/* EMAIL */}
        <div className="mb-5">
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Email Address
          </label>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 group-focus-within:text-[#E1306C] transition-colors">
              <Mail size={18} />
            </span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 text-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E1306C] focus:border-transparent transition-all duration-300 ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-700 hover:border-gray-600"
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle size={12} /> {errors.email}
            </p>
          )}
        </div>

        {/* PASSWORD */}
        <div className="mb-5">
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Password
          </label>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 group-focus-within:text-[#E1306C] transition-colors">
              <Lock size={18} />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              className={`w-full pl-10 pr-12 py-3 bg-gray-800/50 text-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E1306C] focus:border-transparent transition-all duration-300 ${
                errors.password
                  ? "border-red-500"
                  : "border-gray-700 hover:border-gray-600"
              }`}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-300 transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle size={12} /> {errors.password}
            </p>
          )}
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Confirm Password
          </label>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 group-focus-within:text-[#E1306C] transition-colors">
              <Lock size={18} />
            </span>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className={`w-full pl-10 pr-12 py-3 bg-gray-800/50 text-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E1306C] focus:border-transparent transition-all duration-300 ${
                errors.confirmPassword
                  ? "border-red-500"
                  : "border-gray-700 hover:border-gray-600"
              }`}
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-300 transition"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle size={12} /> {errors.confirmPassword}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="relative w-full bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] text-white font-semibold py-3 px-4 rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#E1306C] focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg"
        >
          <span className="flex items-center justify-center gap-2">
            Sign Up <ArrowRight size={18} />
          </span>
        </button>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => switchView("login")}
              className="text-[#E1306C] hover:text-[#F77737] font-semibold transition-colors duration-300 hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </>
    );
  };

  const renderForgotPasswordForm = () => {
    return (
      <>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] bg-clip-text text-transparent mb-2">
            Reset Password
          </h2>
          <p className="text-gray-400">We'll send you a reset link</p>
        </div>

        {/* EMAIL */}
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Email Address
          </label>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 group-focus-within:text-[#E1306C] transition-colors">
              <Mail size={18} />
            </span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 text-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E1306C] focus:border-transparent transition-all duration-300 ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-700 hover:border-gray-600"
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle size={12} /> {errors.email}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="relative w-full bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] text-white font-semibold py-3 px-4 rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#E1306C] focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg"
        >
          <span className="flex items-center justify-center gap-2">
            Send Reset Link <ArrowRight size={18} />
          </span>
        </button>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Remember your password?{" "}
            <button
              type="button"
              onClick={() => switchView("login")}
              className="text-[#E1306C] hover:text-[#F77737] font-semibold transition-colors duration-300 hover:underline"
            >
              Back to Login
            </button>
          </p>
        </div>
      </>
    );
  };

  const renderResetPasswordForm = () => {
    return (
      <>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] bg-clip-text text-transparent mb-2">
            Set New Password
          </h2>
          <p className="text-gray-400">Create a new secure password</p>
        </div>

        {/* NEW PASSWORD */}
        <div className="mb-5">
          <label className="block text-gray-300 text-sm font-medium mb-2">
            New Password
          </label>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 group-focus-within:text-[#E1306C] transition-colors">
              <Lock size={18} />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              className={`w-full pl-10 pr-12 py-3 bg-gray-800/50 text-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E1306C] focus:border-transparent transition-all duration-300 ${
                errors.newPassword
                  ? "border-red-500"
                  : "border-gray-700 hover:border-gray-600"
              }`}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-300 transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle size={12} /> {errors.newPassword}
            </p>
          )}
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Confirm New Password
          </label>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 group-focus-within:text-[#E1306C] transition-colors">
              <Lock size={18} />
            </span>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              className={`w-full pl-10 pr-12 py-3 bg-gray-800/50 text-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E1306C] focus:border-transparent transition-all duration-300 ${
                errors.confirmPassword
                  ? "border-red-500"
                  : "border-gray-700 hover:border-gray-600"
              }`}
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-300 transition"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle size={12} /> {errors.confirmPassword}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="relative w-full bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] text-white font-semibold py-3 px-4 rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#E1306C] focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg"
        >
          <span className="flex items-center justify-center gap-2">
            Reset Password <ArrowRight size={18} />
          </span>
        </button>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            <button
              type="button"
              onClick={() => switchView("login")}
              className="text-[#E1306C] hover:text-[#F77737] font-semibold transition-colors duration-300 hover:underline"
            >
              Back to Login
            </button>
          </p>
        </div>
      </>
    );
  };

  const renderTokenError = () => {
    return (
      <>
        <div className="text-center mb-8">
          {/* Error Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertTriangle size={40} className="text-red-500" />
            </div>
          </div>

          <h2 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-2">
            Invalid or Expired Link
          </h2>
          <p className="text-gray-400 mt-2">
            This password reset link is invalid or has expired.
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Please request a new password reset link.
          </p>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => switchView("forgotPassword")}
            className="w-full bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] text-white font-semibold py-3 px-4 rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#E1306C] focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg"
          >
            <span className="flex items-center justify-center gap-2">
              Request New Reset Link <ArrowRight size={18} />
            </span>
          </button>

          <button
            type="button"
            onClick={() => switchView("login")}
            className="w-full bg-gray-800/50 text-white font-semibold py-3 px-4 rounded-xl hover:bg-gray-700/50 transition-all duration-300 border border-gray-700 hover:border-[#E1306C]"
          >
            <span className="flex items-center justify-center gap-2">
              Back to Login
            </span>
          </button>
        </div>
      </>
    );
  };

  const renderForm = () => {
    switch (view) {
      case "login":
        return renderLoginForm();
      case "register":
        return renderRegisterForm();
      case "forgotPassword":
        return renderForgotPasswordForm();
      case "resetPassword":
        return token ? renderResetPasswordForm() : renderTokenError();
      default:
        return renderLoginForm();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative">
      {renderForm()}
    </form>
  );
};

export default AuthForm;
