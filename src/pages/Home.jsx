import React from "react";
import Sidebar from "../components/Sidebar";
import Stories from "../components/Stories";
import Feed from "../components/Feed";

const Home = () => {
  return (
    <div className=" backdrop-blur-xl bg-black  flex text-white min-h-screen">
      <Sidebar />

      <main className="flex-1 w-full p-4 mx-auto flex flex-col gap-6 overflow-auto">
        <Stories />
        <Feed />
        This Is home page main section
      </main>
    </div>
  );
};

export default Home;
