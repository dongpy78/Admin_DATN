import Login from "../pages/auth/login";
import LayoutAuth from "../layouts/LayoutAuth";

const AuthRoutes = {
  path: "auth",
  element: <LayoutAuth />,
  children: [
    {
      path: "login",
      element: <Login />,
    },
  ],
};

export default AuthRoutes;
