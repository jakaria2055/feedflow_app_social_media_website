import React from "react";
import SuggestedUser from "../components/SuggestedUser";
import { ArrowLeft, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SuggestedUsersPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 w-full min-h-screen mx-auto p-5">
      {/* Back Button - Optional */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-5 left-5 p-2 rounded-full bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/50 transition-all duration-300 group"
      >
        <ArrowLeft size={20} className="text-gray-400 group-hover:text-white transition-colors" />
      </button>

      <div className="max-w-lg w-full mx-auto flex flex-col items-center justify-center min-h-screen">
        {/* Header Section with Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#833AB4] to-[#E1306C] p-[2px] shadow-lg shadow-pink-500/30 mb-4">
            <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
              <Users size={28} className="text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] bg-clip-text text-transparent">
            Suggested Users
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Discover and connect with new people
          </p>
        </div>

        {/* Suggested Users Container */}
        <div className="w-full bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-2xl shadow-black/50 p-6">
          <SuggestedUser />
        </div>
      </div>
    </div>
  );
};

export default SuggestedUsersPage;