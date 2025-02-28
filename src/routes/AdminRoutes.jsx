import LayoutAdmin from "../layouts/LayoutAdmin";
import NotFound from "../pages/NotFound";
import User from "../pages/users";
import AdminPage from "../pages/admin-page";
import TypeJob from "../pages/type-job";
import Profile from "../pages/profile";
import DashboardLayout from "../pages/dashboard-layout";
import AddUser from "../components/users/AddUser";
import EditUser from "../components/users/EditUser";
import AddTypeJob, { action } from "../components/type-jobs/AddTypeJob";
import EditTypeJob from "../components/type-jobs/EditTypeJob";
import AddSkill from "../components/skills/AddSkill";
import EditSkill from "../components/skills/EditSkill";

import { action as addTypeJobAction } from "../components/type-jobs/AddTypeJob";
import {
  loader as editTypeJobLoader,
  action as editTypeJobAction,
} from "../components/type-jobs/EditTypeJob";
import {
  loader as typeJobLoader,
  action as typeJobAction,
} from "../pages/type-job";

import Skills, {
  loader as skillsLoader,
  action as skillsAction,
} from "../pages/skills";
import {
  loader as editSkillLoader,
  action as editSkillAction,
} from "../components/skills/EditSkill";
import {
  loader as addSkillLoader,
  action as addSkillAction,
} from "../components/skills/AddSkill";
import Level from "../pages/level";
import WorkType from "../pages/work-type";
import Salary from "../pages/salary";
import Experience from "../pages/experience";
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
    { path: "list-user", element: <User /> },
    { path: "list-user/add", element: <AddUser /> },
    { path: "list-user/edit", element: <EditUser /> },
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
    {
      path: "work-skill",
      element: <Skills />,
      loader: skillsLoader,
      action: skillsAction,
    },
    {
      path: "work-skill/add",
      element: <AddSkill />,
      loader: addSkillLoader, // Đảm bảo loader được định nghĩa
      action: addSkillAction,
    },
    {
      path: "work-skill/edit/:id",
      element: <EditSkill />,
      loader: editSkillLoader,
      action: editSkillAction,
    },
    { path: "work-level", element: <Level /> },
    { path: "work-type", element: <WorkType /> },
    { path: "work-salary", element: <Salary /> },
    { path: "work-exp", element: <Experience /> },
    { path: "admin", element: <AdminPage /> },
    { path: "profile", element: <Profile /> },
    { path: "*", element: <NotFound /> },
  ],
};

export default AdminRoutes;
