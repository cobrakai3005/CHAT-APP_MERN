import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "../../Providers/AuthContext";

export default function Login() {
  const { login } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [load, setLoad] = useState(false);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoad(true);
      if (!email || !password) {
        toast.error("Please Fill all fields");
      }
      await login({ email, password });
      await new Promise((res, rej) => setTimeout(res, 1400));
    } catch (error) {
    } finally {
      setLoad(false);
      navigate("/chats");
    }
  };
  return (
    <div className="w-full space-y-4 tracking-wider">
      <form onSubmit={handleSubmit} className="p-2 space-y-2">
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
            placeholder="Enter your email"
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
              className="px-4 py-2 border-[1px] border-sky-500/20 outline-none rounded-md focus:ring-1 focus:ring-white/30 focus:backdrop-blur-sm flex-1"
              placeholder="Enter your Password"
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
          className="w-full relative bg-[#03045e]  hover:scale-95 text-white py-2 rounded-md font-mono"
        >
          {load ? "Loading...." : "Login"}
        </button>
      </form>
    </div>
  );
}
