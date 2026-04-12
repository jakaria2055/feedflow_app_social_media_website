import React from "react";
import Sidebar from "../components/Sidebar";
import Stories from "../components/Stories";
import Feed from "../components/Feed";
import SuggestedUser from "../components/SuggestedUser";


const Home = () => {

  return (
    <div className=" backdrop-blur-xl bg-black  flex text-white min-h-screen">
      <Sidebar />

      <main className="flex-1 w-full p-4 mx-auto flex flex-col gap-6 overflow-auto">
        <Stories />
        <div className="flex">
          <Feed />
          <div className="max-w-80 w-full h-fit lg:block hidden p-4">
            <SuggestedUser />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
