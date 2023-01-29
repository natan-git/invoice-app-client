import React from "react";
import "./Backdrop.css";
import { useNavigate, useParams } from "react-router-dom";

const Backdrop = (props) => {
  const navigate = useNavigate();

  return (
    <div className="backdrop" onClick={props.onClick}>
      {props.children}
    </div>
  );
};
export default Backdrop;
