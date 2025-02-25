import React, { useContext } from "react";
import { GlobalContext } from "../../contexts/GlobalProviders";
import { BsFillSunFill, BsFillMoonFill } from "react-icons/bs";
import Wrapper from "../../assets/wrappers/ThemeToggle";

const ThemeToggle = () => {
  const { isDarkTheme, toggleDarkTheme } = useContext(GlobalContext);

  return (
    <Wrapper onClick={toggleDarkTheme}>
      {isDarkTheme ? (
        <BsFillSunFill className="toggle-icon" />
      ) : (
        <BsFillMoonFill className="toggle-icon" />
      )}
    </Wrapper>
  );
};

export default ThemeToggle;
