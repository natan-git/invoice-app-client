import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./InvoiceItem.css";
import { themeContext } from "../../App";
import arrowRight from "../../assets/arrow-right.svg";

const InvoiceItem = (props) => {
  const { theme } = useContext(themeContext);

  return (
    <Link to={`/invoices/${props.id}`} style={{ textDecoration: "none" }}>
      <li className="invoice-item" id={theme}>
        <div className="invoice-item__id">
          <span>#</span>
          <p>{props.id.substring(0, 6)}</p>
        </div>
        <p className="invoice-item__paymentDue">
          <span>Due</span>
          {props.paymentDue}
        </p>
        <p className="invoice-item__clientName">
          {props.clientName.length > 15
            ? props.clientName.substring(0, 15).concat("...")
            : props.clientName}
        </p>
        <p className="invoice-item__total">
          <span>$</span>
          {props.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </p>
        <span className={`status ${props.status.toLowerCase()}`}>
          {props.status}
        </span>
        <img
          className="icon-arrow-right"
          src={arrowRight}
          alt="icon-arrow-right"
        />
      </li>
    </Link>
  );
};

export default InvoiceItem;
