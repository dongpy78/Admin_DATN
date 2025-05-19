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
import Level from "../pages/level";
import WorkType from "../pages/work-type";
import Salary from "../pages/salary";
import Experience from "../pages/experience";

//! TYPEJOB
import { action as addTypeJobAction } from "../components/type-jobs/AddTypeJob";
import {
  loader as editTypeJobLoader,
  action as editTypeJobAction,
} from "../components/type-jobs/EditTypeJob";
import {
  loader as typeJobLoader,
  action as typeJobAction,
} from "../pages/type-job";

//! LEVEL
import AddLevel, { action as addLevel } from "../components/levels/AddLevel";
import EditLevel, {
  loader as editLevelLoader,
  action as editLevelAction,
} from "../components/levels/EditLevel";
import { loader as levelLoader, action as levelAction } from "../pages/level";

//! SKILLS
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

//! USERS
import {
  loader as editUserLoader,
  action as editUserAction,
} from "../components/users/EditUser";
import { loader as userLoader, action as userAction } from "../pages/users";

//! WORK TYPE
import AddWorkType, {
  action as addWorkType,
} from "../components/work-type/AddWorkType";
import EditWorkType, {
  loader as editWorkTypeLoader,
  action as editWorkTypeAction,
} from "../components/work-type/EditWorkType";
import {
  loader as workTypeLoader,
  action as workTypeAction,
} from "../pages/work-type";

//! SALARY TYPE
import AddSalary, {
  action as addSalaryType,
} from "../components/salary/AddSalary";
import EditSalary, {
  loader as editSalaryTypeLoader,
  action as editSalaryTypeAction,
} from "../components/salary/EditSalary";
import {
  loader as salaryLoader,
  action as salaryAction,
} from "../pages/salary";

//! EXP TYPE
import AddExperience, {
  action as addExperienceType,
} from "../components/experience/AddExperience";
import EditExperience, {
  loader as editExperienceTypeLoader,
  action as editExperienceTypeAction,
} from "../components/experience/EditExperience";
import {
  loader as experienceLoader,
  action as experienceAction,
} from "../pages/experience";

//! COMPANY TYPE
import Company, {
  loader as companyLoader,
  action as companyAction,
} from "../pages/company";

//! COMPANY TYPE
import Post, {
  loader as postLoader,
  action as postAction,
} from "../pages/post";
import DetailCompany from "../components/company/DetailCompany";
import DetailPost from "../components/post/DetailPost";
import PackagePost from "../pages/package-post";
import AddPackagePost from "../components/package-post/AddPackagePost";
import PackageCv from "../pages/package-cv";
import AddPackageCv from "../components/package-cv/AddPackageCv";
import CategoryBlogIT from "../pages/category-blog-it";
import BlogIT from "../pages/blog-it";
import BlogITTag from "../pages/blog-it-tags";
import AddCategoryBlog from "../components/categories-blog/AddCategoryBlog";

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
    //! USERS
    { index: true, path: "", element: <DashboardLayout /> },
    {
      path: "list-user",
      element: <User />,
      loader: userLoader,
      action: userAction,
    },
    { path: "list-user/add", element: <AddUser /> },
    {
      path: "list-user/edit/:id",
      element: <EditUser />,
      loader: editUserLoader,
      action: editUserAction,
    },

    //! TYPE-JOB
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

    //! WORK SKILL
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

    //! WORK LEVEL
    {
      path: "work-level",
      element: <Level />,
      loader: levelLoader,
      action: levelAction,
    },
    {
      path: "work-level/add",
      element: <AddLevel />,
      action: addLevel,
    },
    {
      path: "work-level/edit/:code",
      element: <EditLevel />,
      loader: editLevelLoader,
      action: editLevelAction,
    },

    //! WORK TYPE
    {
      path: "work-type",
      element: <WorkType />,
      loader: workTypeLoader,
      action: workTypeAction,
    },
    { path: "work-type/add", element: <AddWorkType />, action: addWorkType },
    {
      path: "work-type/edit/:code",
      element: <EditWorkType />,
      loader: editWorkTypeLoader,
      action: editWorkTypeAction,
    },

    //! SALARY TYPE
    {
      path: "work-salary",
      element: <Salary />,
      loader: salaryLoader,
      action: salaryAction,
    },
    { path: "work-salary/add", element: <AddSalary />, action: addSalaryType },
    {
      path: "work-salary/edit/:code",
      element: <EditSalary />,
      loader: editSalaryTypeLoader,
      action: editSalaryTypeAction,
    },

    //! SALARY TYPE
    {
      path: "work-exp",
      element: <Experience />,
      loader: experienceLoader,
      action: experienceAction,
    },
    {
      path: "work-exp/add",
      element: <AddExperience />,
      action: addExperienceType,
    },
    {
      path: "work-exp/edit/:code",
      element: <EditExperience />,
      loader: editExperienceTypeLoader,
      action: editExperienceTypeAction,
    },

    //! COMPANY
    {
      path: "company",
      element: <Company />,
      loader: companyLoader,
      action: companyAction,
    },

    {
      path: "company/detail/:id", // Thêm route cho chi tiết công ty
      element: <DetailCompany />,
    },

    //! POST
    {
      path: "post",
      element: <Post />,
      loader: postLoader,
      action: postAction,
    },

    {
      path: "post/detail/:id", // Thêm route cho chi tiết công ty
      element: <DetailPost />,
    },

    //! PACKAGES POST
    {
      path: "package-post",
      element: <PackagePost />,
    },
    {
      path: "package-post/add",
      element: <AddPackagePost />,
    },
    {
      path: "package-post/edit/:id",
      element: <AddPackagePost />,
    },

    { path: "admin", element: <AdminPage /> },
    { path: "profile", element: <Profile /> },
    { path: "*", element: <NotFound /> },

    //! PACKAGES CV
    {
      path: "package-cv",
      element: <PackageCv />,
    },
    {
      path: "package-cv/add",
      element: <AddPackageCv />,
    },
    {
      path: "package-cv/edit/:id",
      element: <AddPackageCv />,
    },

    //! Category Blog
    {
      path: "categories-blog",
      element: <CategoryBlogIT />,
    },
    {
      path: "categories-blog/add",
      element: <AddCategoryBlog />,
    },
    {
      path: "categories-blog/edit/:id",
      element: <AddCategoryBlog />,
    },

    //! Blog IT
    {
      path: "blog-it",
      element: <BlogIT />,
    },

    //! Blog Tags
    {
      path: "tag-blog",
      element: <BlogITTag />,
    },
  ],
};

export default AdminRoutes;
