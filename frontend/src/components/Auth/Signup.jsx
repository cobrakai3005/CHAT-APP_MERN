import axios from "axios";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { useUser } from "../../Providers/AuthContext";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState();
  const [show, setShow] = useState(false);
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();
  const { register } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please Fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Password must match");
      return;
    }
    try {
      await register({ name, email, password, pic });
      await navigate("/chats");
    } catch (error) {
    } finally {
      setLoad(false);
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setPic();
    }
  };
  return (
    <div className="w-full space-y-4">
      <form
        onSubmit={handleSubmit}
        className="p-2 space-y-2"
        encType="multipart/form-data"
      >
        {pic && <img src={pic || ""} alt="" />}
        {load ? "Loading..." : null}
        <div className="flex flex-col space-y-2">
          <label className="text-md font-mono" htmlFor="name">
            Name:{" "}
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-2 border-[1px] border-sky-500/20 outline-none tracking-wider rounded-md focus:ring-1 focus:ring-white/30 focus:backdrop-blur-sm flex-1"
            placeholder="Enter your name"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-md font-mono" htmlFor="profile_pic">
            Upload Photo:{" "}
          </label>
          <p>{load ? "Loading.... " : ""}</p>
          <input
            id="profile_pic"
            type="file"
            name="profile_pic"
            onChange={(e) => setPic(e.target.files[0])}
            className="px-4 py-2 border-[1px] border-sky-500/20 outline-none tracking-wider rounded-md focus:ring-1 focus:ring-white/30 focus:backdrop-blur-sm flex-1"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-md font-mono" htmlFor="email">
            Email:{" "}
          </label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 border-[1px] border-sky-500/20 outline-none tracking-wider rounded-md focus:ring-1 focus:ring-white/30 focus:backdrop-blur-sm flex-1"
            placeholder="Johndoe@gmail.com"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-md font-mono" htmlFor="password">
            Password:{" "}
          </label>
          <div className="w-full flex items-center">
            <input
              id="password"
              type={`${show ? "text" : "password"}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-2 border-[1px] border-sky-500/20 outline-none tracking-wider rounded-md focus:ring-1 focus:ring-white/30 focus:backdrop-blur-sm flex-1"
              placeholder="**********************"
            />
            <button
              className="text-sm font-mono"
              type="button"
              onClick={() => setShow(!show)}
            >
              Show
            </button>
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-md font-mono" htmlFor="confirmPassword">
            Confirm Password:{" "}
          </label>
          <div className="w-full flex items-center">
            <input
              id="confirmPassword"
              type={`${show ? "text" : "password"}`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="px-4 py-2 border-[1px] border-sky-500/20 outline-none tracking-wider rounded-md focus:ring-1 focus:ring-white/30 focus:backdrop-blur-sm flex-1"
              placeholder="**********************"
            />
            <button
              className="text-sm font-mono"
              type="button"
              onClick={() => setShow(!show)}
            >
              Show
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#03045e] hover:scale-95 text-white py-2 rounded-md font-mono"
        >
          {load ? "Loading......" : "Sign up"}
        </button>
      </form>
    </div>
  );
}
