import React from "react";
import { useUser } from "../Providers/AuthContext";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";

export default function Protect({ children }) {
  const { user, getMe } = useUser();
  useEffect(() => {
    getMe();
  }, []);

  if (!user) return <Navigate to={"/"} />;
  return children;
}
