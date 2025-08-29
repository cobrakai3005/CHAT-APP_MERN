import React, { useRef } from "react";

export default function FullScreenImage({ setImageOpen, setImage, image }) {
  const imageDiv = useRef(null);
  return (
    <div
      ref={imageDiv}
      onClick={(e) => {
        if (e.target === imageDiv.current) {
          setImageOpen(false);
          setImage();
        }
      }}
      className="absolute top-0  flex justify-center items-center left-0 w-full h-screen bg-black/70"
    >
      <img className={"w-[40%] "} src={image} alt="" />
    </div>
  );
}
