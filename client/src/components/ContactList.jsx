import {
  setSelectedChatData,
  setSelectedChatMessages,
  setSelectedChatType,
} from "@/features/user.slice";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarImage } from "./ui/avatar";
import { getColour } from "@/lib/utils";
import { HOST } from "@/utils/constant";

const ContactList = ({ contacts, isChannel = false }) => {
  const dispatch = useDispatch();
  const { selectedChatType, selectedChatData } = useSelector(
    (state) => state.chat
  );
  const handleClick = (contact) => {
    if (isChannel) {
      dispatch(setSelectedChatType("channel"));
    } else {
      dispatch(setSelectedChatType("contact"));
    }
    dispatch(setSelectedChatData(contact));

    if (selectedChatData && selectedChatData._id !== contact._id) {
      dispatch(setSelectedChatMessages([]));
    }
  };
  return (
    <div className="mt-5">
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
            selectedChatData && selectedChatData._id === contact._id
              ? "bg-[#8417ff] hover:bg-[#8417ff]"
              : "hover:bg-[#f1f1f111]"
          } `}
          onClick={() => handleClick(contact)}
        >
          <div className="flex gap-5 items-center justify-start text-neutral-300">
            {!isChannel && (
              <Avatar className="h-12 w-12  rounded-full overflow-hidden">
                {contact?.image ? (
                  <AvatarImage
                    src={`${HOST}/${contact?.image}`}
                    alt="profile"
                    className="h-full w-full object-cover bg-black"
                  />
                ) : (
                  <div
                    className={`
                        ${
                          selectedChatData &&
                          selectedChatData._id === contact._id
                            ? "bg-[ffffff22] border border-white/70"
                            : getColour(contact?.color)
                        }
                        uppercase w-10 h-10 text-lg border-[1px] flex items-center justify-center rounded-full ${getColour(
                          contact?.color || ""
                        )}`}
                  >
                    {contact.firstname && contact.lastname
                      ? contact.firstname.split("").shift()
                      : contact.email.split("").shift()}
                  </div>
                )}
              </Avatar>
            )}
            {isChannel && (
              <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                #
              </div>
            )}
            {isChannel ? (
              <span> {contact.name} </span>
            ) : (
              <span> {`${contact.firstname} ${contact.lastname}`}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
