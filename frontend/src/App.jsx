import { Outlet } from "react-router-dom";
import bg from "../src/assets/background.jpg";
import { toast, ToastContainer } from "react-toastify";
import { useTheme } from "./Providers/ThemeProvider";
// bg-gradient-to-br from-amber-400/70 to-transparent
export default function App() {
  const { dark } = useTheme();
  return (
    <div
      className={`${
        dark ? "dark" : ""
      } w-full min-h-screen bg-zinc-900/70  relative`}
    >
      {/* <img
        className="w-full h-full absolute top-0 left-0 bg-black z-[-1]"
        src={bg}
        alt=""
      /> */}
      <img
        className="w-full object-cover h-full absolute top-0 left-0 bg-black z-[-1]"
        src="https://static.vecteezy.com/system/resources/previews/010/549/829/original/girl-texting-on-phone-messaging-chatting-with-friend-online-looking-at-smart-phone-typing-online-conversation-and-communication-concept-illustration-free-vector.jpg"
        alt=""
      />

      {/* <div
        className={`absolute inset-0 z-[-1] ${
          dark ? "bg-zinc-900" : "bg-black/50"
        }`}
      /> */}
      {/* <div className={`absolute inset-0 z-[-1] bg-amber-300/70`} /> */}
      <Outlet />
      <ToastContainer />
    </div>
  );
}
