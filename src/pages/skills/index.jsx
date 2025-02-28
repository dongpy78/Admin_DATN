import React from "react";
import axiosInstance from "../../libs/axiosInterceptor";
import {
  showSuccessToast,
  showErrorToast,
} from "../../utils/toastNotifications";
import SkillTableWrapper from "../../assets/wrappers/SkillTableWrapper";

import { useLoaderData, useActionData, useNavigate } from "react-router-dom";
import SearchSkill from "../../components/skills/SearchSkill";
import TableSkill from "../../components/skills/TableSkill";

const Skills = () => {
  return (
    <SkillTableWrapper>
      <SearchSkill />
      <TableSkill />
    </SkillTableWrapper>
  );
};

export default Skills;
