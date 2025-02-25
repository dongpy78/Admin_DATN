import { IoBarChartSharp } from "react-icons/io5";
import { MdQueryStats } from "react-icons/md";
import { FaWpforms } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import { MdAdminPanelSettings } from "react-icons/md";
import { HiOutlineHome } from "react-icons/hi2";

const links = [
  {
    text: "Dashboard",
    path: ".",
    icon: <HiOutlineHome />,
  },
  {
    text: "Users",
    path: "users",
    icon: <FaWpforms />,
  },
  {
    text: "Jobs",
    path: "jobs",
    icon: <MdQueryStats />,
  },
  {
    text: "Skills",
    path: "skills",
    icon: <IoBarChartSharp />,
  },
  {
    text: "profile",
    path: "profile",
    icon: <ImProfile />,
  },
  {
    text: "admin",
    path: "admin",
    icon: <MdAdminPanelSettings />,
  },
];

export default links;
