import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import links from "../../utils/links";
import { GlobalContext } from "../../contexts/GlobalProviders";

const NavLinks = ({ isBigSidebar }) => {
  const { toggleSidebar, user } = useContext(GlobalContext);

  return (
    <div className="nav-links">
      {links.map((link) => {
        const { text, path, icon } = link;
        return (
          <NavLink
            key={text}
            to={path}
            className="nav-link"
            onClick={isBigSidebar ? null : toggleSidebar}
            end
          >
            <span className="icon">{icon}</span>
            {text}
          </NavLink>
        );
      })}
    </div>
  );
};

export default NavLinks;
