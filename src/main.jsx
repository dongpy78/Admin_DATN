import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import "./index.css";
// import App from "./App.jsx";

fetch("/api/v1/get-allcode?type=test")
  .then((res) => res.json())
  .then((data) => console.log(data));

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
