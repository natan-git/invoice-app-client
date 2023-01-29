import React, { useState, useEffect, useContext } from "react";
import { Navigate, useParams } from "react-router-dom";
import InvoiceList from "../components/InvoiceList";
import AppHeader from "../../shared/components/navigation/AppHeader";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

const UserInvoices = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedInvoices, setLoadedInvoices] = useState();

  // Filter logic
  const [filteredStatus, setFilteredStatus] = useState("All");
  const filterChangeHandler = (selectedStatus) => {
    setFilteredStatus(selectedStatus);
  };

  const InvoiceToShow = () => {
    console.log("InvoiceToShow FUNC run in userInvoices....");

    if (filteredStatus == "All") {
      return loadedInvoices;
    } else {
      const filteredInvoices = loadedInvoices.filter((invoice) => {
        return invoice.status === filteredStatus;
      });
      return filteredInvoices;
    }
  };

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    console.log("useEffect run in userInvoices....");
    const fetchInvoices = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL +
            `/invoices/user/${storedData.userId}`
        );
        setLoadedInvoices(responseData.invoices);
      } catch (err) {}
    };

    fetchInvoices();
  }, [sendRequest]);

  return (
    <section className="wrapper">
      <AppHeader
        selectedFilter={filteredStatus}
        invoices={loadedInvoices}
        onChangeFilter={filterChangeHandler}
      />
      {error && <ErrorModal asOverly />}
      <div className="center">{isLoading && <LoadingSpinner />}</div>
      {loadedInvoices && <InvoiceList items={InvoiceToShow()} />}
    </section>
  );
};

export default UserInvoices;
