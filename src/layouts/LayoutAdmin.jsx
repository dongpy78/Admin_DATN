import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import Wrapper from "../assets/wrappers/Dashboard";
import {
  BigSidebar,
  Navbar,
  SmallSidebar,
} from "../components/layout-dashboard";
import { GlobalContext } from "../contexts/GlobalProviders";
import "../index.css";
import GlobalStyles from "../styles/GlobalStyles";

const LayoutAdmin = ({ isDarkThemeEnabled }) => {
  const { isDarkTheme } = useContext(GlobalContext);
  return (
    <Wrapper>
      <GlobalStyles />
      <main className={`dashboard ${isDarkTheme ? "dark-theme" : ""}`}>
        <SmallSidebar />
        <BigSidebar />
        <div style={{ height: "100%" }}>
          <Navbar />
          <div className="dashboard-page">
            <Outlet />
          </div>
        </div>
      </main>
    </Wrapper>
  );
};

export default LayoutAdmin;
