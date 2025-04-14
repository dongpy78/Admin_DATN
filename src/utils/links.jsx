import { IoBarChartSharp } from "react-icons/io5";
import { MdQueryStats } from "react-icons/md";
import { FaWpforms } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import { MdAdminPanelSettings } from "react-icons/md";
import { HiOutlineHome } from "react-icons/hi2";
import { SiLevelsdotfyi } from "react-icons/si";
import { FaBusinessTime } from "react-icons/fa6";
import { GiMoneyStack } from "react-icons/gi";
import { GiBrain } from "react-icons/gi";
import { BsBuildingCheck } from "react-icons/bs";
import { BsFillFileTextFill } from "react-icons/bs";
import { GoPackage } from "react-icons/go";

const links = [
  {
    text: "Dashboard",
    path: ".",
    icon: <HiOutlineHome />,
  },
  {
    text: "Users",
    path: "list-user",
    icon: <FaWpforms />,
  },
  {
    text: "Jobs",
    path: "type-job",
    icon: <MdQueryStats />,
  },
  {
    text: "Skills",
    path: "work-skill",
    icon: <IoBarChartSharp />,
  },
  {
    text: "Levels",
    path: "work-level",
    icon: <SiLevelsdotfyi />,
  },
  {
    text: "WorkTypes",
    path: "work-type",
    icon: <FaBusinessTime />,
  },
  {
    text: "Salary Amount",
    path: "work-salary",
    icon: <GiMoneyStack />,
  },
  {
    text: "Experience",
    path: "work-exp",
    icon: <GiBrain />,
  },
  {
    text: "Company",
    path: "company",
    icon: <BsBuildingCheck />,
  },
  {
    text: "Post",
    path: "post",
    icon: <BsFillFileTextFill />,
  },
  {
    text: "Package Post",
    path: "package-post",
    icon: <GoPackage />,
  },
  {
    text: "Package Cv",
    path: "package-cv",
    icon: <GoPackage />,
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
