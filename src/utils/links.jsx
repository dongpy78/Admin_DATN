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
import { FaBookOpen } from "react-icons/fa";
import { AiFillTags } from "react-icons/ai";
import { BiSolidCategory } from "react-icons/bi";

const links = [
  {
    text: "Trang chủ",
    path: ".",
    icon: <HiOutlineHome />,
  },
  {
    text: "Quản lý người dùng",
    path: "list-user",
    icon: <FaWpforms />,
  },
  {
    text: "Quản lý loại công việc",
    path: "type-job",
    icon: <MdQueryStats />,
  },
  {
    text: "Quản lý kỹ năng",
    path: "work-skill",
    icon: <IoBarChartSharp />,
  },
  {
    text: "Quản lý cấp bậc",
    path: "work-level",
    icon: <SiLevelsdotfyi />,
  },
  {
    text: "Quản lý hình thức làm việc",
    path: "work-type",
    icon: <FaBusinessTime />,
  },
  {
    text: "Quản lý khoảng lương",
    path: "work-salary",
    icon: <GiMoneyStack />,
  },
  {
    text: "Quản lý kinh nghiệm làm việc",
    path: "work-exp",
    icon: <GiBrain />,
  },
  {
    text: "Quản lý các công ty",
    path: "company",
    icon: <BsBuildingCheck />,
  },
  {
    text: "Quản lý bài đăng",
    path: "post",
    icon: <BsFillFileTextFill />,
  },
  {
    text: "Quản lý danh mục blog",
    path: "categories-blog",
    icon: <BiSolidCategory />,
  },
  {
    text: "Quản lý blog IT",
    path: "blogs-it",
    icon: <FaBookOpen />,
  },
  {
    text: "Quản lý tags blog",
    path: "tag-blog",
    icon: <AiFillTags />,
  },
  {
    text: "Quản lý gói bài đăng",
    path: "package-post",
    icon: <GoPackage />,
  },
  {
    text: "Quản lý gói xem ứng viên",
    path: "package-cv",
    icon: <GoPackage />,
  },
  {
    text: "Hồ sơ cá nhân",
    path: "profile",
    icon: <ImProfile />,
  },
  // {
  //   text: "admin",
  //   path: "admin",
  //   icon: <MdAdminPanelSettings />,
  // },
];

export default links;
