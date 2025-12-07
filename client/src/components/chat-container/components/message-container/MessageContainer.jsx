import {
  setFileDownloadProgress,
  setIsDownloading,
  setSelectedChatMessages,
  useGetMessagesMutation,
} from "@/features/user.slice";
import { HOST } from "@/utils/constant";
import moment from "moment/moment";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { fetchFileApi } from "@/components/api/uploadFileApi";

const MessageContainer = () => {
  const { selectedChatData, selectedChatType, selectedChatMessages } =
    useSelector((state) => state.chat);
  const userInfo = useSelector((state) => state.user.userInfo);
  const scrollRef = useRef();
  const [getMessages] = useGetMessagesMutation();
  const dispatch = useDispatch();
  const [chatJustSelected, setChatJustSelected] = useState(false);
  //const [fetchFile] = useLazyFetchFileQuery();
  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  useEffect(() => {
    const getAllMessages = async () => {
      try {
        const response = await getMessages({
          id: selectedChatData._id,
        }).unwrap();
        if (response.messages) {
          dispatch(setSelectedChatMessages(response.messages));
          setChatJustSelected(true);
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    if (selectedChatData._id) {
      if (selectedChatType === "contact") {
        getAllMessages();
      }
    }
  }, [selectedChatData, selectedChatType]);

  // useEffect(() => {
  //   if (scrollRef.current) {
  //     scrollRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [selectedChatMessages]);
  useLayoutEffect(() => {
    if (chatJustSelected && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "auto" }); // instant scroll
      setChatJustSelected(false); // reset
    }
  }, [chatJustSelected]);

  // Optional: scroll on new messages if needed
  useLayoutEffect(() => {
    if (!chatJustSelected && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  // check if image , then showing a different component for image
  const checkIfImage = (filePath) => {
    // Match common image extensions: jpg, jpeg, png, gif, webp, bmp
    const imageRegex = /\.(jpg|jpeg|png|gif|webp|bmp|svg|ico|heif|heic)$/i;
    return imageRegex.test(filePath);
  };

  const checkIfAudio = (filePath) => {
  const audioRegex = /\.(mp3|wav|m4a|aac|ogg|flac)$/i;
  return audioRegex.test(filePath);
  };

  const checkIfVideo = (filePath) => {
  const videoRegex = /\.(mp4|mkv|mov|webm|avi)$/i;
  return videoRegex.test(filePath);
  };

  const checkIfDocument = (filePath) => {
  const docRegex = /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|zip|rar)$/i;
  return docRegex.test(filePath);
  };

  const downloadFile = async (url) => {
  try {
    dispatch(setIsDownloading(true));
    dispatch(setFileDownloadProgress(0));

    const response = await fetchFileApi(url, (progressEvent) => {
      const { loaded, total } = progressEvent;
      if (total) {
        const percentCompleted = Math.round((loaded * 100) / total);
        dispatch(setFileDownloadProgress(percentCompleted));
      }
    });

    // response.data ab Blob hai (kyunki responseType: "blob" set kiya)
    const blobUrl = URL.createObjectURL(response.data);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.setAttribute("download", url.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Download failed", error);
  } finally {
    dispatch(setIsDownloading(false));
    dispatch(setFileDownloadProgress(0));
  }
};

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && dmRenderMessages(message)}
          {selectedChatType === "channel" && RenderChannelMessages(message)}
        </div>
      );
    });
  };

  const dmRenderMessages = (message) => (
    <div
      className={`${
        message.sender === selectedChatData._id ? "text-left" : "text-right"
      }`}
    >
      {message.messageType === "text" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 "
              : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20 "
          } border inline-block rounded my-1 max-w-[50%] break-words `}
        >
          {message.content}
        </div>
      )}
      {message.messageType === "file" && (
  <div
    className={`${
      message.sender !== selectedChatData._id
        ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 "
        : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20 "
    } border inline-block rounded my-1 max-w-[70%] break-words p-2`}
  >
    {/* IMAGE */}
    {checkIfImage(message.fileUrl) && (
      <div
        className="cursor-pointer"
        onClick={() => {
          setShowImage(true);
          setImageUrl(message.fileUrl);
        }}
      >
        <img
          src={`${HOST}/${message.fileUrl}`}
          className="max-h-[300px] max-w-full object-contain rounded"
        />
      </div>
    )}

    {/* AUDIO */}
    {checkIfAudio(message.fileUrl) && (
      <div className="flex flex-col gap-2">
        <audio
          controls
          src={`${HOST}/${message.fileUrl}`}
          className="w-full"
        />
        <button
          className="flex items-center gap-2 text-sm bg-black/20 px-3 py-1 rounded-full hover:bg-black/40 transition-all"
          onClick={() => downloadFile(message.fileUrl)}
        >
          <IoMdArrowRoundDown />
          <span>{message.fileUrl.split("/").pop()}</span>
        </button>
      </div>
    )}

    {/* VIDEO */}
    {checkIfVideo(message.fileUrl) && (
  <div className="flex flex-col gap-2">
    <div className="max-w-[320px] md:max-w-[420px]">
      <video
        controls
        src={`${HOST}/${message.fileUrl}`}
        className="w-full rounded-lg"
      />
    </div>
    <button
      className="flex items-center gap-2 text-xs md:text-sm bg-black/20 px-3 py-1 rounded-full hover:bg-black/40 transition-all"
      onClick={() => downloadFile(message.fileUrl)}
    >
      <IoMdArrowRoundDown />
      <span className="truncate max-w-[200px] md:max-w-[260px]">
        {message.fileUrl.split("/").pop()}
      </span>
    </button>
  </div>
)}



    {/* DOC / ZIP / OTHER */}
    {!checkIfImage(message.fileUrl) &&
      !checkIfAudio(message.fileUrl) &&
      !checkIfVideo(message.fileUrl) && (
        <div className="flex items-center justify-start gap-4">
          <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
            <MdFolderZip />
          </span>
          <span className="truncate max-w-[200px]">
            {message.fileUrl.split("/").pop()}
          </span>
          <span
            className="bg-black/20 text-2xl p-3 rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
            onClick={() => downloadFile(message.fileUrl)}
          >
            <IoMdArrowRoundDown />
          </span>
        </div>
      )}
  </div>
)}

      <div className="text-xs text-gray-600">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  );

  
  const RenderChannelMessages = (message) => {
  const isOwn = message.sender._id === userInfo.userId;

  return (
    <div className={`mt-5 ${isOwn ? "text-right" : "text-left"}`}>
      {/* TEXT MESSAGE */}
      {message.messageType === "text" && (
        <div
          className={`${
            isOwn
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 "
              : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20 "
          } border inline-block rounded my-1 max-w-[60%] break-words px-3 py-2`}
        >
          {message.content}
        </div>
      )}

      {/* FILE MESSAGE (image / audio / video / docs) */}
      {message.messageType === "file" && (
        <div
          className={`${
            isOwn
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 "
              : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20 "
          } border inline-block rounded my-1 max-w-[70%] break-words p-2`}
        >
          {/* IMAGE */}
          {checkIfImage(message.fileUrl) && (
            <div
              className="cursor-pointer"
              onClick={() => {
                setShowImage(true);
                setImageUrl(message.fileUrl);
              }}
            >
              <img
                src={`${HOST}/${message.fileUrl}`}
                className="max-h-[300px] max-w-full object-contain rounded"
              />
            </div>
          )}

          {/* AUDIO */}
          {checkIfAudio(message.fileUrl) && (
            <div className="flex flex-col gap-2">
              <audio
                controls
                src={`${HOST}/${message.fileUrl}`}
                className="w-full"
              />
              <button
                className="flex items-center gap-2 text-xs md:text-sm bg-black/20 px-3 py-1 rounded-full hover:bg-black/40 transition-all"
                onClick={() => downloadFile(message.fileUrl)}
              >
                <IoMdArrowRoundDown />
                <span className="truncate max-w-[200px] md:max-w-[260px]">
                  {message.fileUrl.split("/").pop()}
                </span>
              </button>
            </div>
          )}

          {/* VIDEO */}
          {checkIfVideo(message.fileUrl) && (
            <div className="flex flex-col gap-2">
              <div className="max-w-[320px] md:max-w-[420px]">
                <video
                  controls
                  src={`${HOST}/${message.fileUrl}`}
                  className="w-full rounded-lg"
                />
              </div>
              <button
                className="flex items-center gap-2 text-xs md:text-sm bg-black/20 px-3 py-1 rounded-full hover:bg-black/40 transition-all"
                onClick={() => downloadFile(message.fileUrl)}
              >
                <IoMdArrowRoundDown />
                <span className="truncate max-w-[200px] md:max-w-[260px]">
                  {message.fileUrl.split("/").pop()}
                </span>
              </button>
            </div>
          )}

          {/* DOC / OTHER */}
          {!checkIfImage(message.fileUrl) &&
            !checkIfAudio(message.fileUrl) &&
            !checkIfVideo(message.fileUrl) && (
              <div className="flex items-center justify-start gap-4">
                <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span className="truncate max-w-[200px]">
                  {message.fileUrl.split("/").pop()}
                </span>
                <span
                  className="bg-black/20 text-2xl p-3 rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={() => downloadFile(message.fileUrl)}
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
        </div>
      )}

      {/* TIME (optional for channels) */}
      <div className="text-xs text-gray-600">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
    );
  };


  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xlg:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef}></div>
      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
          <div className="">
            <img
              src={`${HOST}/${imageUrl}`}
              className="h-[80vh] w-full bg-cover"
            />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button
              className="bg-black/20 text-2xl p-3 rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => downloadFile(imageUrl)}
            >
              <IoMdArrowRoundDown />
            </button>
            <button
              className="bg-black/20 text-2xl p-3 rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => {
                setShowImage(false);
                setImageUrl(null);
              }}
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
