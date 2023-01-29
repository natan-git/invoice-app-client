import React, { useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import { themeContext } from "../../App";
import Button from "../../shared/components/UIElements/Button";
import LetteredAvatar from "react-lettered-avatar";
import { Link } from "react-router-dom";

import invoicesCount from "../../assets/illustration-empty.svg";
import "./Profile.css";
const Profile = (props) => {
  const auth = useContext(AuthContext);
  const { theme } = useContext(themeContext);

  console.log(auth);
  return (
    <section className="profile-wrapper">
      <div className="profile-header">
        <h2>
          Welcome <span>{auth.user.userName}</span>
        </h2>
        <div className="profile-header__blob">
          <div className="blob"></div>
          <span>You Are Logged in</span>
        </div>
      </div>
      <div className="profile-info" id={theme}>
        <div>
          <LetteredAvatar
            size={80}
            name={auth.user.userName}
            color="#7b5cfa"
            backgroundColor="#f9f9fb"
          />
          <div className="info-box">
            <h1>{auth.user.userName}</h1>
            <h2>{auth.user.email}</h2>
          </div>
        </div>
        <div>
          <Button inverse onClick={auth.logout}>
            Logout
          </Button>
        </div>
      </div>
      <div className="user-invoices">
        <img src={invoicesCount} />
        {/* <p>
          You created <span>{auth.user.invoices.length}</span>
        </p> */}
        <Link to="/invoices">
          <Button>View Invoices</Button>
        </Link>
      </div>
    </section>
  );
};

export default Profile;
