import { useSocket } from "@/context/SocketContext";
import { setFileUploadProgress, setIsUploading } from "@/features/user.slice";
import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { uploadFileApi } from "@/components/api/uploadFileApi";

const MessageBar = () => {
  const socket = useSocket();
  const inputFileRef = useRef();
  const [message, setMessage] = useState("");
  const emojiRef = useRef();
  const [emojiPickerOpen, SetEmojiPickerOpen] = useState(false);
  const { selectedChatType, selectedChatData } = useSelector(
    (state) => state.chat
  );
  const { userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Close emoji picker on outside click
  useEffect(() => {
    const handleClickOutSide = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        SetEmojiPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, []);

  // Add emoji
  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  // ⭐ FINAL SEND FUNCTION (Enter + button both use this)
  const handleSendMessage = async () => {
    if (!message.trim()) return; // prevent sending empty message

    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo.userId,
        content: message,
        receipent: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      });
    } else if (selectedChatType === "channel") {
      socket.emit("send-channel-message", {
        sender: userInfo.userId,
        content: message,
        messageType: "text",
        fileUrl: undefined,
        channelId: selectedChatData._id,
      });
    }

    setMessage(""); // clear input after sending
  };

  // Attachment click
  const handleAttachmentClick = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  // File upload + send
  const handleAttachmentChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        dispatch(setIsUploading(true));
        const response = await uploadFileApi(formData, (progressEvent) => {
          const { loaded, total } = progressEvent;
          if (total) {
            const percentCompleted = Math.round((loaded * 100) / total);
            dispatch(setFileUploadProgress(percentCompleted));
          }
        });

        if (response && response.filePath) {
          dispatch(setIsUploading(false));

          if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
              sender: userInfo.userId,
              content: undefined,
              receipent: selectedChatData._id,
              messageType: "file",
              fileUrl: response.filePath,
            });
          } else if (selectedChatType === "channel") {
            socket.emit("send-channel-message", {
              sender: userInfo.userId,
              content: undefined,
              messageType: "file",
              fileUrl: response.filePath,
              channelId: selectedChatData._id,
            });
          }
        }
      }
    } catch (error) {
      dispatch(setIsUploading(false));
      console.log(error);
    }
  };

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        
        {/* ⭐ INPUT BOX WITH ENTER-TO-SEND */}
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSendMessage(); // ⭐ Enter triggers send
            }
          }}
        />

        <button
          className="text-neutral-500 cursor-pointer"
          onClick={handleAttachmentClick}
        >
          <GrAttachment className="text-2xl" />
        </button>

        <input
          type="file"
          className="hidden"
          ref={inputFileRef}
          onChange={handleAttachmentChange}
        />

        {/* Emoji Section */}
        <div className="relative">
          <button
            className="text-neutral-500 cursor-pointer"
            onClick={() => SetEmojiPickerOpen(true)}
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker
              theme="dark"
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>

      {/* ⭐ SEND BUTTON (same function as Enter) */}
      <button
        className="bg-[#8417ff] p-5 rounded-md hover:bg-[#741bda] cursor-pointer"
        onClick={handleSendMessage}
      >
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;
