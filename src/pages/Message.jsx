import React, { useEffect } from "react";
import MessageSidebar from "../components/MessageSidebar";
import { useDispatch, useSelector } from "react-redux";
import ProfileImage from "../components/ProfileImage";
import { getAllMessages } from "../redux/slices/messageSlice";
import EmptyMessage from "../components/EmptyMessage";

const Message = () => {
  const dispatch = useDispatch();
  const { users, selectedUser, messages } = useSelector(
    (state) => state.messages,
  );
  const { user: currentUser } = useSelector((state) => state.user);

  const openMediaModal = () => {};

  useEffect(() => {
    dispatch(getAllMessages(selectedUser?._id));
  }, [dispatch, selectedUser?._id]);

  return (
    <div className="flex min-h-screen bg-black">
      <MessageSidebar />

      <main className="rounded-xl text-white flex-1 w-full mx-auto flx flex-col gap-6 overflow-auto">
        <div className={`flex flex-col pl-20 md:pl-0 h-screen text-white`}>
          {selectedUser && (
            <div className="text-white sticky top-0 left-0 right-0 z-20 border-b border-white/10 py-5 flex justify-end px-5 md:px-8 items-center">
              <ProfileImage user={selectedUser} username />
            </div>
          )}

          {messages.length === 0 ? (
            <EmptyMessage />
          ) : (
            <div className="flex-1 overflow-y-auto p-5 no-scrollbar">
              {messages?.map((msg, idx) => {
                const isSender = msg.senderId === currentUser?._id;
                return (
                  <div
                    className={`flex ${isSender ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[60%] w-auto p-3 rounded-xl ${isSender ? "bg-indigo-600 text-white" : "bg-gray-300 text-black"} space-y-2 cursor-pointer`}
                      onClick={() => msg?.mediaUrl && openMediaModal(msg)}
                    ></div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Message;
