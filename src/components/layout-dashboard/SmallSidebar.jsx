import React, { useContext } from "react";
import { FaTimes } from "react-icons/fa";
import Wrapper from "../../assets/wrappers/SmallSidebar";
import { GlobalContext } from "../../contexts/GlobalProviders";
import NavLinks from "./NavLinks";
import Logo from "./Logo";

const SmallSidebar = () => {
  const { showSidebar, toggleSidebar } = useContext(GlobalContext);
  return (
    <Wrapper>
      <div
        className={
          showSidebar ? "sidebar-container show-sidebar" : "sidebar-container"
        }
      >
        <div className="content">
          <button type="button" className="close-btn" onClick={toggleSidebar}>
            <FaTimes />
          </button>
          <header>
            <Logo />
          </header>
          <NavLinks />
        </div>
      </div>
    </Wrapper>
  );
};

export default SmallSidebar;
