import React from "react";

import LayoutHome from "../layouts/LayoutHome";
import Landing from "../pages/landing";
import Login from "../pages/auth/login";

const HomeRoutes = {
  path: "/",
  element: <LayoutHome />,
  children: [
    {
      index: true,
      element: <Landing />,
    },
    {
      path: "login",
      element: <Login />,
    },
  ],
};

export default HomeRoutes;
