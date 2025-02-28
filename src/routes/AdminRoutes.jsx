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
import AddTypeJob, { action } from "../components/type-jobs/AddTypeJob";
import EditTypeJob from "../components/type-jobs/EditTypeJob";
import { action as addTypeJobAction } from "../components/type-jobs/AddTypeJob";
import {
  loader as editTypeJobLoader,
  action as editTypeJobAction,
} from "../components/type-jobs/EditTypeJob";
import {
  loader as typeJobLoader,
  action as typeJobAction,
} from "../pages/type-job";
import AddSkill from "../components/skills/AddSkill";
import EditSkill from "../components/skills/EditSkill";
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
    {
      path: "type-job",
      element: <TypeJob />,
      loader: typeJobLoader,
      action: typeJobAction,
    },
    { path: "type-job/add", element: <AddTypeJob />, action: addTypeJobAction },
    {
      path: "type-job/edit/:code",
      element: <EditTypeJob />,
      loader: editTypeJobLoader,
      action: editTypeJobAction,
    },
    { path: "skills", element: <Skill /> },
    { path: "skills/add", element: <AddSkill /> },
    { path: "skills/edit", element: <EditSkill /> },
    { path: "admin", element: <AdminPage /> },
    { path: "profile", element: <Profile /> },
    { path: "*", element: <NotFound /> },
  ],
};

export default AdminRoutes;
