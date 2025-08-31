import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("auth-user")) || undefined
  );

  const register = async (user) => {
    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("password", user.password);
    formData.append("profile_pic", user.pic);

    const res = await fetch(`${import.meta.env.VITE_API_URL}/users/register`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.success == true) {
      localStorage.setItem("auth-user", JSON.stringify(data.user));
      localStorage.setItem("auth-token", JSON.stringify(data.user.token));
      setUser(data.user);
      toast.success("Logged In Successfully");
    } else {
      setUser(null);
      localStorage.removeItem("auth-user");
      localStorage.removeItem("auth-token");
      toast.error(data.message);
    }
  };
  const login = (user) => {
    fetch(`${import.meta.env.VITE_API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success === true) {
          localStorage.setItem("auth-user", JSON.stringify(data.user));
          localStorage.setItem("auth-token", JSON.stringify(data.user.token));
          setUser(data.user);
          toast.success("Logged In Successfully");
        } else {
          setUser(null);
          localStorage.removeItem("auth-user");
          localStorage.removeItem("auth-token");
          toast.error(data.message);
        }
      });
  };

  const logout = () => {
    fetch(`${import.meta.env.VITE_API_URL}/users/sign-out`)
      .then((res) => res.json())
      .then((data) => {
        setUser();
        localStorage.removeItem("auth-token");
        localStorage.removeItem("auth-user");
        toast.success("Logged Out Successfully");
      })
      .catch((er) => {
        toast.error(er.message);
      });
  };

  const getMe = () => {
    const token = JSON.parse(localStorage.getItem("auth-token"));
    if (token) {
      fetch(`${import.meta.env.VITE_API_URL}/users/get-me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
        });
    } else {
      return;
    }
  };

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("auth-token"));
    if (token) {
      getMe();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ login, user, logout, getMe, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useUser = () => useContext(AuthContext);
