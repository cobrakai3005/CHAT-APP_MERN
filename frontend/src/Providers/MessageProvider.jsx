import { createContext, useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import sound from "../assets/sound.mp3";
import { useUser } from "./AuthContext";

export const MessageContext = createContext();

export default function MessageProvider({ children, socket }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [someoneTyping, setSomeoneTyping] = useState(false);
  const [searchParams] = useSearchParams();
  const startChatsWith = searchParams.get("user");
  const notify = new Audio(sound);
  const { user } = useUser();

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
  }, [socket]);

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
    <MessageContext.Provider
      value={{ messages, setMessages, someoneTyping, loading }}
    >
      {children}
    </MessageContext.Provider>
  );
}

export const useMessages = () => useContext(MessageContext);
