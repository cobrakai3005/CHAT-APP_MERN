import { useUser } from "../../Providers/AuthContext";
import { CiLogout } from "react-icons/ci";
import ProfileSection from "./ProfileSection";
import { CornerDownRight, CornerRightUp, HatGlasses } from "lucide-react";

export default function SmallPanel({ handleClick, isOpen }) {
  const { logout, user } = useUser();

  return (
    <div
      className={`bg-zinc-800 px-3 ${
        isOpen ? "rounded-2xl" : "rounded-[250px]"
      } flex flex-col gap-3 py-5 justify-between ${
        !isOpen ? "items-center" : "items-end pr-3"
      }`}
    >
      <button
        onClick={handleClick}
        className="hidden cursor-pointer hover:bg-amber-300 sm:flex justify-center items-center bg-white  w-10 h-10 rounded-full"
      >
        {isOpen ? (
          <CornerRightUp className="text-2xl text-zinc-700 " />
        ) : (
          <CornerDownRight className="text-2xl text-zinc-700 " />
        )}
      </button>

      {!isOpen && (
        <div className="flex flex-col gap-4">
          <p className="sm:-rotate-90 sm:whitespace-nowrap text-[17px] font-mono md:text-3xl tracking-widest text-amber-300/60">
            {user.name}
          </p>
        </div>
      )}

      {isOpen && <ProfileSection />}
      {!isOpen && (
        <div className="flex flex-row sm:flex-col gap-2">
          <button
            onClick={logout}
            className="flex cursor-pointer justify-center items-center bg-zinc-700  w-10 h-10 rounded-full text-zinc-50 font-bold hover:bg-amber-500"
          >
            <CiLogout className="" />
          </button>
        </div>
      )}

      {isOpen && (
        <button
          onClick={logout}
          className="flex w-full cursor-pointer justify-center items-center bg-red-500 text-md  h-12 rounded-full text-zinc-50 hover:rounded-2xl font-bold hover:bg-amber-500"
        >
          Logout
        </button>
      )}
    </div>
  );
}
