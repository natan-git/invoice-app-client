import React from "react";
import UserItem from "./UserItem";

const UsersList = (props) => {
  if (props.items.length === 0) {
    return (
      <div>
        <h2>No users found.</h2>
      </div>
    );
  }

  return (
    <ul>
      {props.items.map((user) => (
        <UserItem key={user.id} id={user.id} name={user.name} />
      ))}
    </ul>
  );
};

export default UsersList;
