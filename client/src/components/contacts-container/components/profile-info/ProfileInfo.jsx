import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColour } from "@/lib/utils";
import { HOST } from "@/utils/constant";
import { useDispatch, useSelector } from "react-redux";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FiEdit2 } from "react-icons/fi";
import { IoLogOut, IoPowerSharp } from "react-icons/io5";
import { setUserInfo } from "@/features/user.slice";
import { useNavigate } from "react-router-dom";
import { useLogOutMutation } from "@/features/user.slice";
import { toast } from "sonner";

const ProfileInfo = () => {
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.user.userInfo);
  const [logOut] = useLogOutMutation();
  const dispatch = useDispatch();
  const userLogOut = async () => {
    try {
      const response = await logOut().unwrap();
      console.log("response", response);
      if (response.success) {
        toast.success(response.message);
        dispatch(setUserInfo(null));
        navigate("/auth");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to Logout");
    }
  };
  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]">
      <div className="flex gap-3 items-center justify-center">
        <div className="w-12 h-12 relative">
          <Avatar className="h-12 w-12  rounded-full overflow-hidden">
            {userInfo.image ? (
              <AvatarImage
                src={`${HOST}/${userInfo.image}`}
                alt="profile"
                className="h-full w-full object-cover bg-black"
              />
            ) : (
              <div
                className={`uppercase w-12 h-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColour(
                  userInfo?.color || ""
                )}`}
              >
                {userInfo.firstName
                  ? userInfo.firstName.split("").shift()
                  : userInfo.email?.split("").shift()}
              </div>
            )}
          </Avatar>
        </div>
        <div>
          {userInfo.firstName && userInfo.lastName
            ? `${userInfo.firstName} ${userInfo.lastName}`
            : ""}
        </div>
      </div>
      <div className="flex gap-5">
        <Tooltip>
          <TooltipTrigger>
            <FiEdit2
              className="text-purple-500 text-xl font-medium cursor-pointer"
              onClick={() => navigate("/profile")}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none text-white">
            <p>Edit Profile</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <IoPowerSharp
              className="text-red-500 text-xl font-medium cursor-pointer"
              onClick={() => userLogOut()}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none text-white">
            <p>LogOut</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default ProfileInfo;
