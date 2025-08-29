import React from "react";

export default function StartChating() {
  return (
    <div className="flex  h-full flex-col font-mono justify-center items-center animate-fadeIn">
      <div className="w-[300px] rounded-full bg-sky-100 flex items-center justify-center mb-4">
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8 text-amber-300"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.625 16.485l-3.39 1.257a.375.375 0 01-.49-.353v-10.23a.375.375 
           0 01.49-.353l3.39 1.257m0 0v8.422m0-8.422l7.125-2.64m0 0l3.375-1.25a.375.375
           0 01.495.348v10.262a.375.375 0 01-.495.348l-3.375-1.25m-7.125-5.968v8.422"
          />
        </svg> */}
        <img
          src="https://static.vecteezy.com/system/resources/previews/010/549/829/original/girl-texting-on-phone-messaging-chatting-with-friend-online-looking-at-smart-phone-typing-online-conversation-and-communication-concept-illustration-free-vector.jpg"
          alt=""
        />
      </div>
      <h2 className="text-2xl font-bold text-amber-500">Start Chat</h2>
      <p className="mt-2 text-amber-500 max-w-xs text-center">
        Select a user from the sidebar to begin your conversation.
      </p>
    </div>
  );
}
