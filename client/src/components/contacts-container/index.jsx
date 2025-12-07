import { useEffect, useState } from "react";
import NewDm from "./components/new-dm";
import ProfileInfo from "./components/profile-info/ProfileInfo";
import {
  setChannels,
  setDirectMessagesContact,
  useGetContactsForDMQuery,
  useLazyGetUserChannelsQuery,
} from "@/features/user.slice";
import { useDispatch, useSelector } from "react-redux";
import ContactList from "../ContactList";
import CreateChannel from "./components/create-channel/CreateChannel";

const ContactsContainer = () => {
  const dispatch = useDispatch();
  const { directMessagesContact, channels } = useSelector(
    (state) => state.chat
  );
  const { data, error, isLoading, refetch } = useGetContactsForDMQuery();
  const [trigger] = useLazyGetUserChannelsQuery();

  useEffect(() => {
    const fetchContacts = async () => {
      const res = await refetch();
      if (res?.data?.contacts) {
        dispatch(setDirectMessagesContact(res.data.contacts));
      }
    };

    const getChannels = async () => {
      const response = await trigger().unwrap();
      if (response.success && response.channels) {
        dispatch(setChannels(response.channels));
      }
    };
    fetchContacts();
    getChannels();
  }, [setChannels, setDirectMessagesContact]);

  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20-vw] bg-[#343541]   border-r-2 border-[#2f303b] w-full">
      <div className="pt-3">
        <Logo />
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Direct Messages" />
          <div className="">
            <NewDm />
          </div>
        </div>
        <div className="max-h-[38vh] overflow-auto scrollbar-hidden">
          <ContactList contacts={directMessagesContact} />
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Channels" />
          <CreateChannel />
        </div>
        <div className="max-h-[38vh] overflow-auto scrollbar-hidden">
          <ContactList contacts={channels} isChannel={true} />
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
};

export default ContactsContainer;

export const Logo = () => {
  return (
    <div className="flex p-5  justify-start items-center gap-2">
      <svg
        id="logo-38"
        width="78"
        height="32"
        viewBox="0 0 78 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {" "}
        <path
          d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
          className="ccustom"
          fill="#8338ec"
        ></path>{" "}
        <path
          d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
          className="ccompli1"
          fill="#975aed"
        ></path>{" "}
        <path
          d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
          className="ccompli2"
          fill="#a16ee8"
        ></path>{" "}
      </svg>
      <span className="text-3xl font-semibold ">Syncronus</span>
    </div>
  );
};

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};
