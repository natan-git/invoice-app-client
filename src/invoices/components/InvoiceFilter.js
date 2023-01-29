import React, { useState, useContext } from "react";
import iconArrowDown from "../../assets/icon-arrow-down.svg";
import "./InvoiceFilter.css";
import { themeContext } from "../../App";
const InvoiceFilter = (props) => {
  const { theme } = useContext(themeContext);

  const [open, setOpen] = useState(false);
  const [rotate, setRotate] = useState(false);

  const handleOpen = () => {
    setRotate(!rotate);
    setOpen(!open);
  };
  const handleMenu = (event) => {
    props.onChangeFilter(event.target.value);
    setOpen(false);
    setRotate(false);
  };

  return (
    <div className="dropdown">
      <button onClick={handleOpen} className="long-filter" id={theme}>
        <span className={`long-term ${theme}-text`}>Filter By Status</span>
        <span className={`short-term ${theme}-text`}>Filter</span>
        <img className={rotate ? "open" : "close"} src={iconArrowDown} />
      </button>

      {open ? (
        <div className="menu" id={theme} onChange={handleMenu}>
          <label className="filter-item">
            <input
              type="radio"
              value="All"
              name="All"
              defaultChecked={props.selected === "All"}
            />
            All
          </label>
          <label className="filter-item">
            <input
              defaultChecked={props.selected === "Paid"}
              type="radio"
              value="Paid"
              name="Paid"
            />
            Paid
          </label>
          <label className="filter-item">
            <input
              defaultChecked={props.selected === "Pending"}
              type="radio"
              value="Pending"
              name="Pending"
            />
            Pending
          </label>
          <label className="filter-item">
            <input
              defaultChecked={props.selected === "Draft"}
              type="radio"
              value="Draft"
              name="Draft"
            />
            Draft
          </label>
        </div>
      ) : null}
    </div>
  );
};

export default InvoiceFilter;
