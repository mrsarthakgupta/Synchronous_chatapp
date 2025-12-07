import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./app/store.jsx";
import { Toaster } from "./components/ui/sonner";
import { SocketProvider } from "./context/SocketContext";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <SocketProvider>
      <App />
      <Toaster closeButton />
    </SocketProvider>
  </Provider>
);
