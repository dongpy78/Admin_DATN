// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
// import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
// import customFetch from "./utils/customFetch";
// import App from "./App.jsx";

// const data = await customFetch.get("/get-allcode?type=ROLE");
// console.log(data);

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <RouterProvider router={router} />
  // </StrictMode>
);
