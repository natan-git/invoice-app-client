import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";

import "./SideNav.css";
import { themeContext } from "../../../App";
import { AuthContext } from "../../context/auth-context";
import logo from "../../../assets/invoice-logo.png";
import sun from "../../../assets/icon-sun.svg";
import moon from "../../../assets/icon-moon.svg";
import avatar from "../../../assets/placeholder-avatar.svg";
const SideNav = (props) => {
  const auth = useContext(AuthContext);

  const [themeIcon, setThemeIcon] = useState(sun);
  const { theme, toggleTheme } = useContext(themeContext);
  const toggleIcon = () => {
    setThemeIcon((curr) => (curr === sun ? moon : sun));
    toggleTheme();
  };
  return (
    <aside className="side-nav">
      <div className="logo-warper">
        {auth.isLoggedIn ? (
          <Link to="/invoices">
            <img className="side-nav__logo" src={logo} alt="Invoice app logo" />
          </Link>
        ) : (
          <img className="side-nav__logo" src={logo} alt="Invoice app logo" />
        )}
      </div>

      <div className="bar-content">
        <img className="theme-icon" src={themeIcon} onClick={toggleIcon} />
        <Link to="/">
          <img className="avatar-icon" src={avatar} alt="profile placeholder" />
        </Link>
      </div>
    </aside>
  );
};

export default SideNav;
