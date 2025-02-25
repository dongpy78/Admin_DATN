import LayoutAdmin from "../layouts/LayoutAdmin";
import NotFound from "../pages/NotFound";
import User from "../pages/users";
import AdminPage from "../pages/admin-page";
import TypeJob from "../pages/type-job";
import Profile from "../pages/profile";
import Skill from "../pages/skills";
import DashboardLayout from "../pages/dashboard-layout";
import AddUser from "../components/users/AddUser";
import EditUser from "../components/users/EditUser";

export const checkDefaultTheme = () => {
  const isDarkTheme = localStorage.getItem("darkTheme") === "true";
  document.body.classList.toggle("dark-theme", isDarkTheme);
  return isDarkTheme;
};

const isDarkThemeEnabled = checkDefaultTheme();

const AdminRoutes = {
  path: "/admin",
  element: <LayoutAdmin isDarkThemeEnabled={isDarkThemeEnabled} />, // Sử dụng LayoutAdmin
  children: [
    { index: true, path: "", element: <DashboardLayout /> },
    { path: "users", element: <User /> },
    { path: "users/add", element: <AddUser /> },
    { path: "users/edit", element: <EditUser /> },
    { path: "admin", element: <AdminPage /> },
    { path: "jobs", element: <TypeJob /> },
    { path: "profile", element: <Profile /> },
    { path: "skills", element: <Skill /> },
    { path: "*", element: <NotFound /> },
  ],
};

export default AdminRoutes;
