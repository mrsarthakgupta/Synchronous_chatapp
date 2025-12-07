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
import { Input } from "@/components/ui/input";
import {
  useCreateNewChannelMutation,
  useLazyGetAllContactsQuery,
  addChannel,
  setSelectedChatData,
} from "@/features/user.slice";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multipleselect";

const CreateChannel = () => {
  const dispatch = useDispatch();
  const [newChannelModal, setNewChannelModal] = useState(false);
  const [searchedContact, setSearchedContact] = useState([]);
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState();
  const [channelName, setChannelName] = useState("");
  const [trigger, { data: getAllContacts }] = useLazyGetAllContactsQuery();
  const [createNewChannel, { isLoading, isError, isSuccess, data }] =
    useCreateNewChannelMutation();
  //const [setChannels, addChannel]= useSelector((state)=>state.chat)
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await trigger().unwrap();
        setAllContacts(response.contacts);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  const createChannel = async () => {
    try {
      if (channelName.length > 0 && selectedContacts.length > 0) {
        const response = await createNewChannel({
          name: channelName,
          members: selectedContacts.map((contact) => contact.value),
        }).unwrap();
                  console.log(response)

        console.log(response.channel.name);

        if (response.success) {
          setChannelName("");
          setSelectedContacts([]);
          setNewChannelModal(false);
          console.log(response.channel.name);
          dispatch(addChannel(response.channel));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Tooltip>
        <TooltipTrigger>
          <FaPlus
            className="text-neutral-400 font-light text-opacity-90 text-sm hover:text-neutral-100 cursor-pointer transition-all duration-300"
            onClick={() => setNewChannelModal(true)}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Select New Channel{" "}
          </p>
        </TooltipContent>
      </Tooltip>
      <Dialog open={newChannelModal} onOpenChange={setNewChannelModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex justify-center ">
              Please fill up the details for new channel
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="">
            <Input
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              placeholder="Channel Name"
              onChange={(e) => setChannelName(e.target.value)}
              value={channelName}
            />
          </div>
          <MultipleSelector
            className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
            defaultOptions={allContacts}
            placeholder="Search Contacts"
            value={selectedContacts}
            onChange={setSelectedContacts}
            emptyIndicator={
              <p className="text-center text-lg leading-10 text-gray-600">
                No results found
              </p>
            }
          />
          <div>
            <Button
              className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
              onClick={() => createChannel()}
            >
              Create Channel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateChannel;
