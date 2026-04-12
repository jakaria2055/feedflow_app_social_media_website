import React from "react";
import SuggestedUser from "../components/SuggestedUser";

const SuggestedUsersPage = () => {
  return (
    <div className="bg-black w-full h-screen mx-auto flex items-center justify-center p-5">
      <div className="max-w-md w-full">
        <SuggestedUser />
      </div>
    </div>
  );
};

export default SuggestedUsersPage;
