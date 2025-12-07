import React, { use, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import ChatContainer from "@/components/chat-container";
import ContactsContainer from "@/components/contacts-container";
import EmptyChatContainer from "@/components/empty-chat-container";
const Chat = () => {
  const {
    selectedChatType,
    isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownloadProgress,
  } = useSelector((state) => state.chat);

  // const selectedChatType = useSelector((state)=>state.chat.selectedChatType);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    if (!user.profileSetup) {
      navigate("/profile");
      toast.error("Please complete your profile setup first.");
    }
  }, [user, navigate]);

  return (
    <div className="flex h-[100vh]  text-white  overflow-hidden ">
      {
        isUploading && <div className="flex h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 items-center justify-center flex-col gap-5 backdrop-blur-lg">
          <h5 className="text-5xl">Uploading File</h5>
          {fileUploadProgress}%
        </div>
      }
      {
        isDownloading && <div className="flex h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 items-center justify-center flex-col gap-5 backdrop-blur-lg">
          <h5 className="text-5xl">Downloading File</h5>
          {fileDownloadProgress}%
        </div>
      }
      <ContactsContainer />
      {selectedChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <ChatContainer />
      )}
    </div>
  );
};

export default Chat;
