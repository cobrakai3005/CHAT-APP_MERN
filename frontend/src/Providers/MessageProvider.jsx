import { createContext, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export const MessageContext = createContext();

export default function MessageProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const startChatsWith = searchParams.get("user");

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("auth-token"));
    if (!token) return;
    if (!startChatsWith) return;

    fetch(`${import.meta.env.VITE_API_URL}/messages/${startChatsWith}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.chat && data.chat?.messages.length > 0) {
          setMessages(data.chat?.messages);
        } else {
          setMessages([]);
        }
      });
  }, [startChatsWith]);

  return (
    <MessageContext.Provider value={{ messages, setMessages }}>
      {children}
    </MessageContext.Provider>
  );
}
