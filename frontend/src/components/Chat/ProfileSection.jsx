import { Loader2, Pen } from "lucide-react";
import React, { useRef, useState } from "react";
import { useUser } from "../../Providers/AuthContext";
import { toast } from "react-toastify";
import FullScreenImage from "../FullScreenImage";

export default function ProfileSection() {
  const { user } = useUser();
  const [avatar, setAvatar] = useState(user.avatar.url);
  const [bio, setBio] = useState(user.bio);
  const [form, setForm] = useState(false);
  //   const bio = useRef();
  const [loadProfile, setLoadProfile] = useState(false);
  const [load, setLoad] = useState(false);

  const ref = useRef();

  const uploadPhoto = async (photo) => {
    setLoadProfile(true);
    const formData = new FormData();
    formData.append("avatar", photo);
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/users/update-profile`,
      {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("auth-token")
          )}`,
        },
      }
    );

    const data = await res.json();
    if (data.success) {
      toast.success(data?.message);
      setAvatar(data?.avatar);
    }
    setLoadProfile(false);
  };

  const sendBio = async (e) => {
    e.preventDefault();
    if (!bio || bio == "") return;
    setLoad(true);
    const formData = new FormData();
    formData.append("bio", bio);

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/users/update-profile`,
      {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("auth-token")
          )}`,
        },
      }
    );

    const data = await res.json();
    if (data.success) {
      toast.success(data?.message);
      setBio(bio);
    }
    setForm(false);
    setLoad(false);
  };
  return (
    <div className="w-full h-full flex flex-col gap-1 items-center">
      <div className="relative">
        <img
          className="w-30 h-30 object-cover rounded-full"
          src={avatar}
          alt=""
        />

        <input
          onChange={(e) => uploadPhoto(e.target.files[0])}
          ref={ref}
          type="file"
          name="avatar"
          className="hidden"
        />
        <button
          onClick={() => ref.current.click()}
          className="absolute bottom-0 right-0 cursor-pointer bg-amber-400 hover:bg-zinc-600 p-2 rounded-full"
        >
          {loadProfile ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Pen className="text-white" />
          )}
        </button>
      </div>
      <h2 className="text-white text-3xl font-bold  tracking-wide text-center">
        {user.name}
      </h2>
      <p className="text-white/50 text-md font-bold  tracking-wide text-center">
        {user.email}
      </p>
      <p className="text-white/40 text-sm font-mono">Edit Bio</p>
      <div className="flex gap-2  ">
        {form ? (
          <form action="">
            <input
              type="text"
              value={bio}
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  await sendBio(e);
                }
              }}
              onChange={(e) => setBio(e.target.value)}
              className="px-2 py-1 border-[1px] text-white border-white/70 rounded outline-0"
            />
          </form>
        ) : (
          <div className="flex flex-col justify-center items-center">
            {/* <p className="text-white font-mono">Add Bio</p> */}
            <p className="text-amber-400 font-mono">{bio}</p>
          </div>
        )}

        <button
          onClick={() => setForm(!form)}
          className="cursor-pointer bg-amber-400 disabled:opacity-15 hover:bg-zinc-600 p-2 rounded-full"
        >
          {load ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Pen className="text-white" />
          )}
        </button>
      </div>
      {form && (
        <p className="text-sm text-center text-white/40 font-mono">
          Enter To Send
        </p>
      )}
    </div>
  );
}
