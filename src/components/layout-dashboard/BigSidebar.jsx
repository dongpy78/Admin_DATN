import React, { useContext } from "react";
import { GlobalContext } from "../../contexts/GlobalProviders";
import Wrapper from "../../assets/wrappers/BigSidebar";
import NavLinks from "./NavLinks";
import Logo from "./Logo";

const BigSidebar = () => {
  const { showSidebar } = useContext(GlobalContext);

  return (
    <Wrapper>
      <div
        className={
          showSidebar ? "sidebar-container " : "sidebar-container show-sidebar"
        }
      >
        <div className="content">
          <header>
            <Logo />
          </header>
          <NavLinks isBigSidebar />
        </div>
      </div>
    </Wrapper>
  );
};

export default BigSidebar;
