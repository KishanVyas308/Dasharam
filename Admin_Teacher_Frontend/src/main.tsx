import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { RecoilRoot } from "recoil";
import { Bounce, ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")!).render(

    <RecoilRoot>
      <App />
     
    </RecoilRoot>
);