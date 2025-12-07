import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaPlus } from "react-icons/fa";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HOST } from "@/utils/constant";
import Lottie from "lottie-react";
import lottieanimation from "@/assets/lottieanimation.json";
import { Input } from "@/components/ui/input";
import {
  setSelectedChatData,
  setSelectedChatType,
  useSearchContactsMutation,
} from "@/features/user.slice";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColour } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";

const NewDm = () => {
  const dispatch = useDispatch();
  const [searchContact] = useSearchContactsMutation();
  const [openNewContactModal, setOpenNewContactModal] = useState(false);
  const [searchedContact, setSearchedContact] = useState([]);

  const searchContacts = async (searchTerm) => {
    if (searchTerm.length > 0) {
      try {
        const response = await searchContact({ searchTerm }).unwrap();

        if (response?.contacts) {
          console.log("response", response.contacts);
          setSearchedContact(response.contacts);
        } else {
          setSearchedContact([]);
        }
      } catch (error) {
        console.error("Error:", error);
        setSearchedContact([]);
      }
    }
  };

  const selectedContacts = (contact) => {
    setOpenNewContactModal(false);
    setSearchedContact([]);
    dispatch(setSelectedChatData(contact));
    dispatch(setSelectedChatType("contact"));
  };

  return (
    <div>
      <Tooltip>
        <TooltipTrigger>
          <FaPlus
            className="text-neutral-400 font-light text-opacity-90 text-sm hover:text-neutral-100 cursor-pointer transition-all duration-300"
            onClick={() => setOpenNewContactModal(true)}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Select New Contact{" "}
          </p>
        </TooltipContent>
      </Tooltip>
      <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex justify-center ">
              Select a contact
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="">
            <Input
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              placeholder="Search Contact"
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>
          {searchedContact.length > 0 && (
            <ScrollArea className="h-[250px]">
              <div className="flex flex-col gap-5">
                {searchedContact?.map((contact) => (
                  <div
                    key={contact._id}
                    className="flex gap-3 items-center cursor-pointer"
                    onClick={() => selectedContacts(contact)}
                  >
                    <div className="w-12 h-12 relative mt-4">
                      <Avatar className="h-12 w-12  rounded-full overflow-hidden">
                        {contact.image ? (
                          <AvatarImage
                            src={`${HOST}/${contact.image}`}
                            alt="profile"
                            className="h-full w-full object-cover rounded-full bg-black"
                          />
                        ) : (
                          <div
                            className={`uppercase w-12 h-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColour(
                              contact?.color || ""
                            )}`}
                          ></div>
                        )}
                      </Avatar>
                    </div>
                    <div className="flex flex-col">
                      <span>
                        {contact.firstname && contact.lastname
                          ? `${contact.firstname} ${contact.lastname}`
                          : contact.email}
                      </span>
                      <span className="text-xs">{contact.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          {searchedContact.length <= 0 && (
            <div className="flex-1 md:flex md:mt-0 flex-col md:bg-[#1c1d25] justify-center items-center duration-1000 transition-all mt-5">
              <Lottie
                className="w-40 h-40"
                animationData={lottieanimation}
                loop
                autoplay
              />
              <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-300 text-center">
                <h1 className="poppins-medium">
                  Hi <span className="text-purple-500">!</span> Search New
                  <span className="text-purple-500"> Contact</span>
                </h1>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewDm;
