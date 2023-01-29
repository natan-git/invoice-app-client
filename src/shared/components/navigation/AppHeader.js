import React, { useContext } from "react";
import "./AppHeader.css";
import { Link, useLocation } from "react-router-dom";
import { themeContext } from "../../../App";
import plusIcon from "../../../assets/icon-plus.svg";
import InvoiceFilter from "../../../invoices/components/InvoiceFilter";
import { useSpring, animated } from "react-spring";

const AppHeader = (props) => {
  const fade = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
  });

  const location = useLocation();
  const { theme } = useContext(themeContext);
  return (
    <animated.section className="app-header wrapper" id={theme} style={fade}>
      <div className="app-header-title">
        <h1 className="app-header-title__title">Invoices</h1>
        <span className="app-header-title__total">
          There are {props.invoices ? props.invoices.length : 0} total Invoices
        </span>
      </div>
      <div className="app-header-cta">
        <InvoiceFilter
          selected={props.selectedFilter}
          onChangeFilter={props.onChangeFilter}
        />
        <Link to="/invoices/new" state={{ background: "/" }}>
          <button className="app-header-cta__btn">
            <img src={plusIcon} />
            New
          </button>
        </Link>
      </div>
    </animated.section>
  );
};

export default AppHeader;
