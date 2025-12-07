import { animationDefaultOptions } from "@/lib/utils";
import lottieanimation from "@/assets/lottieanimation.json";
import lottiefile from "@/assets/lottie-json.json";
import Lottie from "lottie-react";
const EmptyChatContainer = () => {
  return (
    <div className="flex-1 md:flex flex-col md:bg-[#1c1d25] justify-center items-center hidden duration-1000 transition-all">
      <Lottie
        className="w-50  h-50"
        animationData={lottieanimation}
        loop
        autoplay
      />
      <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transition-all duration-300 text-center">
        <h1 className="poppins-medium">
          Hi <span className="text-purple-500">!</span> Welcome to
          <span className="text-purple-500"> Synchronus</span> Chat App
          <span className="text-purple-500">.</span>
        </h1>
      </div>
    </div>
  );
};

export default EmptyChatContainer;
