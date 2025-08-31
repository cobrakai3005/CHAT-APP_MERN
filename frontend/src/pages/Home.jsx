import { Navigate } from "react-router-dom";
import AuthTabs from "../components/AuthTabs";
import { useUser } from "../Providers/AuthContext";

export default function Home() {
  const { user } = useUser();
  if (user) return <Navigate to={"/chats"} />;
  return (
    <div className=" w-full h-full flex flex-col gap-4 justify-center p-5">
      <div className="w-full md:w-xl p-2 bg-white/10 backdrop-blur-md border border-white/40    mx-auto rounded-md flex justify-center items-center gap-4">
        <h3 className="text-4xl font-mono text-white text-center">Chat App</h3>
        <div className="flex justify-center items-center">
          <img
            className="w-12 "
            src="https://cdn-icons-png.freepik.com/256/8546/8546677.png"
            alt=""
          />
        </div>
      </div>

      <div className="w-full md:w-2xl p-2 bg-white/20 backdrop-blur-md border border-white/20 mx-auto rounded-md">
        <AuthTabs />
      </div>
    </div>
  );
}
