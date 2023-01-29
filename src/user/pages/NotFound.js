import React from "react";
import img from "../../assets/illustration-empty.svg";
import Button from "../../shared/components/UIElements/Button";
import { Link } from "react-router-dom";
const NotFound = () => {
  return (
    <section className="wrapper center-col">
      <img src={img}></img>
      <div>
        <h1>404</h1>
        <h1>Page Not Found</h1>
        <br />
        <Link to="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
