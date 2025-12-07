import { HOST } from "@/utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { createContext, useContext, useRef, useEffect } from "react";
import { setAddMessage } from "@/features/user.slice";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { selectedChatData, selectedChatType } = useSelector(
    (state) => state.chat
  );
  const userInfo = useSelector((state) => state.user.userInfo);
  const socketRef = useRef(null);

  // connect socket only when userInfo changes
  useEffect(() => {
    if (userInfo) {
      socketRef.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.userId },
      });

      socketRef.current.on("connect", () => {
        console.log("✅ Connected to socket server");
      });

      return () => {
        socketRef.current.disconnect();
      };
    }
  }, [userInfo]);

  // handle incoming messages separately
  useEffect(() => {
    if (!socketRef.current) return;

    const handleReceiveMessage = (message) => {
      if (
        selectedChatType !== undefined &&
        (selectedChatData?._id === message.sender._id ||
          selectedChatData?._id === message.receipent._id)
      ) {
        console.log(" message received", message);
        dispatch(setAddMessage(message));
      }
    };
     const handleReceiveChannelMessage = (message) =>{
        if (
        selectedChatType !== undefined &&
        (selectedChatData?._id === message.senderId ||
          selectedChatData?._id === message.channelId)
      ) {
        console.log(" message received", message);
        dispatch(setAddMessage(message));
      }
    
     }
    socketRef.current.on("receiveMessage", handleReceiveMessage);
    socketRef.current.on("recieve-channel-message", handleReceiveChannelMessage);

    return () => {
      socketRef.current.off("receiveMessage", handleReceiveMessage);
    };
  }, [selectedChatData, selectedChatType, dispatch]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};
