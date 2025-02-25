import React, { useContext } from "react";
import Wrapper from "../../assets/wrappers/Navbar";
import Logo from "./Logo";
import { GlobalContext } from "../../contexts/GlobalProviders";
import { FaAlignLeft } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";
import LogoutContainer from "./LogoutContainer";

const Navbar = () => {
  const { toggleSidebar } = useContext(GlobalContext);
  return (
    <Wrapper>
      <div className="nav-center">
        <button type="button" className="toggle-btn" onClick={toggleSidebar}>
          <FaAlignLeft />
        </button>
        <div>
          <Logo />
          <h4 className="logo-text">Dashboard</h4>
        </div>
        <div className="btn-container">
          <ThemeToggle />
          <LogoutContainer />
        </div>
      </div>
    </Wrapper>
  );
};

export default Navbar;
