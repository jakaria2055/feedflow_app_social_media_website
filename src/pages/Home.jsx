import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Stories from "../components/Stories";
import Feed from "../components/Feed";
import SuggestedUser from "../components/SuggestedUser";

const Home = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="bg-black text-white min-h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main
        className={`transition-all duration-300 p-2 flex flex-col gap-6 ${
          collapsed ? "ml-8" : "ml-14 md:ml-64"
        }`}
      >
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