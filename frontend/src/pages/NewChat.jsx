import { useEffect, useMemo, useRef, useState } from "react";
import sound from "../assets/sound.mp3";
import { RiSendPlaneFill } from "react-icons/ri";
import { IoIosAttach } from "react-icons/io";
import { useUser } from "../Providers/AuthContext";
import io from "socket.io-client";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import StartChating from "../components/StartChating";
import { toast } from "react-toastify";
import { Loader2, Trash, Video } from "lucide-react";
import SmallPanel from "../components/Chat/SmallPanel";
import FullScreenImage from "../components/FullScreenImage";

export default function NewChat() {
  const { user } = useUser();
  const socket = useMemo(() => io(`${import.meta.env.VITE_SOCKET_URL}`), []);
  const [searchParams, setSearchParams] = useSearchParams();
  const startChatsWith = searchParams.get("user");
  const [isOpen, setIsOpen] = useState(false);
  const [videoLink, setVideoLink] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("addUser", user);
    });

    socket.on("onlineUsers", (data) => {});
    socket.on("recieved-video-link", (data) => {
      setVideoLink(data);
    });

    // cleanup => remove only listeners
    return () => {
      socket.off(); // remove all listeners on unmount
      socket.off("recieve_message");
      socket.off("recieved-video-link");
      // socket.off("connect");
    };
  }, [startChatsWith, socket]);

  const handleClick = () => setIsOpen(!isOpen);

  const sendVideoLink = () => {
    const roomId = [user.email, startChatsWith].sort().join("-");
    socket.emit("sending-video-link", {
      roomId,
      from: user.email,
      to: startChatsWith,
    });
    navigate(`/room/${roomId}`);
  };
  return (
    <>
      {videoLink && (
        <div className="absolute top-0 left-0 w-full  bg-amber-400 px-3 py-2 text-white flex flex-col gap-3 rounded ">
          <span className="font-bold text-center">
            Video Call From {videoLink.from}
          </span>
          <div className="w-full flex justify-center items-center gap-5">
            <Link
              to={`/room/${videoLink.roomId}`}
              className="font-mono  bg-green-400 px-4 py-1 rounded"
            >
              Accept
            </Link>
            <button
              onClick={() => setVideoLink()}
              className="bg-red-500 px-4 py-1 rounded"
            >
              Decline
            </button>
          </div>
        </div>
      )}
      <div
        className={`w-full min-h-screen bg-zinc-300 p-4 flex flex-col  sm:grid gap-5  ${
          isOpen
            ? "sm:grid-cols-[500px_400px_1fr]"
            : "grid-cols-[70px_260px_1fr] md:grid-cols-[70px_300px_1fr] "
        }`}
      >
        {/* Small Panel */}
        <SmallPanel handleClick={handleClick} isOpen={isOpen} />
        {/* middle */}
        <MiddlePanel />
        {/* Long Pannel */}
        <div className="bg-white rounded-4xl flex flex-col p-3  gap-3 ">
          {!startChatsWith ? (
            <StartChating />
          ) : (
            <div className="w-full  h-[60px] border-b-[1px] flex  gap-2 items-center border-zinc-800/20">
              <img
                className="w-10"
                src={
                  "https://cdn3.iconfinder.com/data/icons/web-design-and-development-2-6/512/87-1024.png"
                }
                alt=""
              />
              <div className="flex flex-col">
                <h3 className="text-lg font-mono">{startChatsWith}</h3>
                <p className="text-xs">Active now</p>
              </div>
              <button
                onClick={sendVideoLink}
                className="ml-auto bg-amber-300 hover:bg-amber-500 rounded-md text-white px-3 py-2"
              >
                <Video />
              </button>
            </div>
          )}

          {/* Messages */}
          {startChatsWith && (
            <>
              <Messages socket={socket} />
              <MessageInput socket={socket} />
            </>
          )}
        </div>
      </div>
    </>
  );
}

function Chat({ user }) {
  const [searchParams] = useSearchParams();
  const chatUser = searchParams.get("user");

  return (
    <Link
      to={`?user=${user.email}`}
      className={`flex p-3 items-center gap-3 border-b-[1px] ${
        chatUser == user.email ? "bg-blue-700/50" : ""
      } border-zinc-700/30`}
    >
      <img
        className="w-13 h-13 object-cover rounded-full"
        src={
          user.avatar.url ||
          "https://cdn3.iconfinder.com/data/icons/web-design-and-development-2-6/512/87-1024.png"
        }
        alt=""
      />

      <div className="flex flex-col gap">
        <h2 className="text-md font-mono">{user.name}</h2>
        <p className="text-sm font-normal">Hello How are you ?</p>
      </div>
    </Link>
  );
}

function SideIcon({ icon }) {
  return (
    <button className="flex justify-center items-center bg-zinc-700  w-10 h-10 rounded-full hover:bg-amber-400 cursor-pointer">
      {icon}
    </button>
  );
}

function Message({ message }) {
  const [image, setImage] = useState();
  const { user } = useUser();

  const [isImageOpen, setImageOpen] = useState(false);
  const isSender = user.email === message?.senderId?.email;
  const name = isSender ? user.name : message?.senderId?.name;
  const firstLetter = name ? name[0].toUpperCase() : "?";
  // recieverId

  return (
    <>
      {isImageOpen && (
        <FullScreenImage
          image={image}
          setImageOpen={setImageOpen}
          setImage={setImage}
        />
      )}
      <li
        className={`w-fit flex flex-row items-center text-white gap-2 px-3 py-3 rounded-2xl ${
          isSender ? "self-end flex-row-reverse" : "self-start"
        }`}
      >
        <span className="w-[35px] h-[35px] rounded-full inline-flex items-center justify-center bg-[#03045e]">
          {firstLetter}
        </span>
        <span
          className={`max-w-xl text-md font-medium pl-6 pr-3 py-2 rounded-xl ${
            isSender
              ? "bg-[#03045e] text-white"
              : "border-[1px] border-[#03045e] text-[#03045e]"
          }`}
        >
          {message.text}
        </span>
        <div className="relative">
          <img
            onClick={(e) => {
              setImageOpen(!isImageOpen);
              setImage(message?.media?.url);
            }}
            src={message?.media?.url}
            className={`${isImageOpen && "hidden"} rounded-md  w-32 z-[-2]`}
            alt=""
          />
          {/* {message.media && (
            <button
              onClick={() => deleteImage(message.media?.public_id)}
              className="absolute cursor-pointer p-2 rounded-full top-0 -right-5 hover:bg-red-500 hover:text-white"
            >
              <Trash className="text-md hover:bg-red-500 hover:text-white" />
            </button>
          )} */}
        </div>
      </li>
      <p
        className={`block text-sm font-mono ${
          isSender ? "self-end flex-row-reverse" : "self-start"
        }`}
      >
        <span className="time">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </p>
    </>
  );
}

function MiddlePanel() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const token = JSON.parse(localStorage.getItem("auth-token"));
  const [show, setShow] = useState();
  const fetchUsers = async () => {
    setLoading(true);
    await new Promise((res, rej) => setTimeout(res, 1200));
    const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <div className="bg-white rounded-4xl ">
      <div className="flex p-6 items-center justify-between border-b-[1px] border-zinc-700/30">
        <div className="text-2xl text-amber-700 font-mono">
          <h3>{user.name}</h3>
          <h2 className="text-2xl font-semibold text-zinc-800">Inbox </h2>
        </div>
        <button onClick={() => setShow(!show)}>Show</button>
      </div>

      {/* For Big Screen */}
      <div className={`overflow-y-scroll h-[550px]  sm:block`}>
        {loading &&
          new Array(5).fill(9).map((el) => (
            <div className="flex p-3 items-center gap-3 border-b-[1px] border-zinc-700/30">
              <div className="p-6 bg-zinc-200 rounded-full animate-pulse"></div>
              <div className="flex w-full flex-col gap-4 animate-pulse">
                <h2 className="text-md font-mono bg-zinc-200 rounded-md p-2 animate-pulse"></h2>
                <p className="text-sm font-normal bg-zinc-200 p-2 rounded-md animate-pulse"></p>
              </div>
            </div>
          ))}
        {!loading &&
          users.length > 0 &&
          users?.map((el, i) => <Chat key={i} user={el} />)}
      </div>

      {/* For Smaall Screen */}
    </div>
  );
}

function Messages({ socket }) {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [someoneTyping, setSomeoneTyping] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const startChatsWith = searchParams.get("user");
  const notify = new Audio(sound);
  const endRef = useRef(null);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, someoneTyping]);

  useEffect(() => {
    socket.on("recieve_message", (data) => {
      if (data.senderId.email !== user.email) {
        toast(`Message Recieved from ${data.senderId.name}`);
      }
      setMessages((prev) => [...prev, data]);

      notify.play();
    });

    socket.on("typing", () => setSomeoneTyping(true));
    socket.on("stop_typing", () => setSomeoneTyping(false));

    return () => {
      socket.off("recieve_message");

      socket.off("typing");
      socket.off("stop_typing");
    };
  }, []);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("auth-token"));
    if (!token) return;
    if (!startChatsWith) return;

    const fetchMessages = async () => {
      setLoading(true);
      // Wait 3 seconds
      await new Promise((res) => setTimeout(res, 2000));

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/messages/${startChatsWith}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success == true) {
        setMessages(data?.messages);
      } else {
        setMessages([]);
      }

      setLoading(false);
    };

    fetchMessages();
  }, [startChatsWith]);

  return (
    <ul className="w-full flex flex-col gap-2 overflow-y-scroll h-[440px]">
      {loading && (
        <ul className="space-y-2">
          {new Array(10).fill(0).map((_, i) => (
            <li
              key={i}
              className={`flex ${
                i % 2 === 0 ? "justify-start" : "justify-end"
              }`}
            >
              <div className="h-10  w-[300px] rounded-xl bg-blue-700/20 animate-pulse" />
            </li>
          ))}
        </ul>
      )}

      {!loading &&
        messages.length > 0 &&
        messages?.map((msg, i) => <Message key={i} message={msg} />)}
      {!loading && messages.length == 0 && (
        <h1 className="text-md  font-bold text-center text-zinc-600 tracking-wider">
          No Messages yet
        </h1>
      )}
      {someoneTyping && "Typing"}
      <div ref={endRef}></div>
    </ul>
  );
}

function MessageInput({ socket }) {
  const [message, setMessage] = useState("");
  const { user } = useUser();
  const [pic, setPic] = useState();
  const [searchParams, setSearchParams] = useSearchParams();
  const [load, setLoad] = useState(false);
  const startChatsWith = searchParams.get("user");
  const fileRef = useRef();
  const [media, setMedia] = useState();

  const sendMessage = async () => {
    if (message !== "" || message.length > 1) {
      socket.emit("new_message", {
        message,
        media,
        senderEmail: user.email,
        receiverEmail: startChatsWith,
      });

      setMessage("");
      setMedia(undefined);
      setPic(undefined);
    } else {
      toast("Input Field is empty ?");
    }
  };

  const cloudinaryUpload = async (pic) => {
    if (!pic) {
      toast.error("Please select an image");
      return;
    }
    setLoad(true);
    try {
      if (
        pic.type === "image/jpeg" ||
        pic.type === "image/png" ||
        pic.type === "image/webp"
      ) {
        const data = new FormData();
        data.append("file", pic);
        data.append("upload_preset", "chat-app");
        data.append("cloud_name", "dl3vluct6");

        const res = await fetch(
          `${import.meta.env.VITE_CLOUDINARY_UPLOAD_URL}/${
            import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
          }/upload`,
          {
            method: "POST",
            body: data,
          }
        );

        const result = await res.json();

        if (result.secure_url) {
          setPic(result.secure_url.toString());
          setMedia({
            public_id: result.public_id,
            url: result.secure_url,
          });
        } else {
          toast.error("Upload failed, please try again.");
        }
      } else {
        toast.error("Please select an image of type jpeg, png, or webp");
      }
    } catch (error) {
      console.error(error);
      toast.error("Image upload failed");
    } finally {
      // ✅ loader will stop only AFTER upload finishes
      setLoad(false);
    }
  };
  const deleteImage = async (public_id) => {
    setLoad(true);
    const token = JSON.parse(localStorage.getItem("auth-token"));
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/messages/imageDelete/${public_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.success === true) {
        setMedia();
        setPic();
      }
    } catch (error) {
    } finally {
      setLoad(false);
    }
  };

  return (
    <div className="bg-zinc-200/50 flex flex-col gap-1 items-start justify-star rounded-xl p-3">
      <div className="flex w-full">
        <input
          type="text"
          placeholder="😊 Send Your message.."
          spellCheck={"false"}
          value={message}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          onChange={(e) => {
            setMessage(e.target.value);
            socket.emit("typing", {
              senderEmail: user.email,
              receiverEmail: searchParams.get("user"),
            });

            // debounce stop_typing after user stops typing for 1 second
            clearTimeout(window.typingTimeout);
            window.typingTimeout = setTimeout(() => {
              socket.emit("stop_typing", {
                senderEmail: user.email,
                receiverEmail: searchParams.get("user"),
              });
            }, 1000);
          }}
          className="px-4 py-2 outline-none w-full focus:border-b-[1px] border-amber-400/30 rounded font-medium"
        />
        <button
          onClick={sendMessage}
          className="bg-amber-500 px-3 py-2 rounded-3xl"
        >
          <RiSendPlaneFill className="text-xl text-amber-100" />
        </button>
      </div>
      <input
        onChange={(e) => cloudinaryUpload(e.target.files[0])}
        type="file"
        ref={fileRef}
        className="hidden"
      />
      <div className="relative">
        {pic && (
          <button
            onClick={() => deleteImage(media?.public_id)}
            className="absolute cursor-pointer p-2 rounded-full top-0 left-0 hover:bg-red-500 hover:text-white bg-red-400"
          >
            <Trash className="text-md hover:bg-red-500 hover:text-white" />
          </button>
        )}
      </div>
      <img className="w-40" src={pic ? pic : ""} alt="" />
      <button
        onClick={() => fileRef.current.click()}
        className="border cursor-pointer hover:bg-amber-600 border-amber-500 p-1 rounded-3xl"
      >
        {load ? (
          <Loader2 className="animate-spin" />
        ) : (
          <IoIosAttach className="text-xl text-amber-400" />
        )}
      </button>
    </div>
  );
}
