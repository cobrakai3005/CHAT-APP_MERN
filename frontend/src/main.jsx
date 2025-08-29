import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import Home from "./pages/Home.jsx";
import AuthProvider from "./Providers/AuthContext.jsx";
import Protect from "./pages/Protect.jsx";
import ThemeProvider from "./Providers/ThemeProvider.jsx";

import NewChat from "./pages/NewChat.jsx";
import Room from "./pages/Room.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<Home />}></Route>
      <Route path="room/:roomId" element={<Room />}></Route>
      <Route
        path="chats"
        element={
          <Protect>
            <NewChat />
          </Protect>
        }
      ></Route>
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </AuthProvider>
);
