import React, { useEffect, useState } from "react";
import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Chat = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users"
        );
        setLoadedUsers(responseData.users);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]);

  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal error={error} onClear={clearError} />
      <section className="wrapper">
        <h1>All users</h1>
        {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
      </section>
    </React.Fragment>
  );
};

export default Chat;
