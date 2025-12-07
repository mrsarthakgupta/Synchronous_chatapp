import { Button } from "@/components/ui/button";
import React from "react";
import { RiCloseFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { closeChat } from "@/features/user.slice";
import { HOST } from "@/utils/constant";
import { getColour } from "@/lib/utils";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
const ChatHeader = () => {
  const { selectedChatType, selectedChatMessages, selectedChatData } =
    useSelector((state) => state.chat);

  const dispatch = useDispatch();
  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20">
      <div className="flex gap-5 items-center w-full justify-between">
        <div className="flex gap-3 items-center justify-center">
          <div className="w-12 h-12 relative mt-4">
            {selectedChatType === "contact" ? (
              <Avatar className="h-12 w-12  rounded-full overflow-hidden">
                {selectedChatData.image ? (
                  <AvatarImage
                    src={`${HOST}/${selectedChatData.image}`}
                    alt="profile"
                    className="h-full w-full object-cover bg-black"
                  />
                ) : (
                  <div
                    className={`uppercase w-12 h-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColour(
                      selectedChatData?.color || ""
                    )}`}
                  >
                    {selectedChatType === "contact" &&
                    selectedChatData.firstname
                      ? `${selectedChatData.firstname} ${selectedChatData.lastname}`
                      : `${selectedChatData.lastname}`}
                  </div>
                )}
              </Avatar>
            ) : (
              <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                #
              </div>
            )}
          </div>
          <div className="">
            {selectedChatType === "channel" && selectedChatData?.name}
            {selectedChatType === "contact" && selectedChatData.firstname
              ? `${selectedChatData.firstname} ${selectedChatData.lastname}`
              : `${selectedChatData.lastname}`}
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all cursor-pointer"
            onClick={() => dispatch(closeChat())}
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
