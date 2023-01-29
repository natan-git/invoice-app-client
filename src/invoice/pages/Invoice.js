import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { themeContext } from "../../App";
import { AuthContext } from "../../shared/context/auth-context";
import Modal from "../../shared/components/UIElements/Modal";
import Button from "../../shared/components/UIElements/Button";
import { useSpring, animated } from "react-spring";

import "./Invoice.css";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Invoice = (props) => {
  const fade = useSpring({
    from: { opacity: 0, y: 50 },
    to: { opacity: 1, y: 0 },
  });

  const auth = useContext(AuthContext);

  const location = useLocation();
  const [loadedInvoice, setLoadedInvoice] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const invoiceId = useParams().invoiceId;

  useEffect(() => {
    const fetchInvoiceById = async (invoiceId) => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/invoices/${invoiceId}`
        );
        setLoadedInvoice(responseData.invoice);
      } catch (err) {}
    };
    fetchInvoiceById(invoiceId);
  }, [sendRequest]);

  // ------------------delete btn modal logic-----------------
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const openConfirmModalHandler = () => setShowConfirmModal(true);
  const closeConfirmModalHandler = () => setShowConfirmModal(false);

  const confirmDeleteHandler = async () => {
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/invoices/${invoiceId}`,
        "DELETE",
        null,
        {
          authorization: "Bearer " + auth.user.token,
        }
      );
      navigate("/invoices");
    } catch (err) {}
  };

  // mark as paid
  const markAsPaid = async (event) => {
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/invoices/${invoiceId}`,
        "PATCH",
        JSON.stringify({
          createdAt: "1.2.2023",
          paymentDue: "1.3.2023",
          description: loadedInvoice.description,
          paymentTerms: "net 30 days",
          clientName: loadedInvoice.clientName,
          clientEmail: loadedInvoice.clientEmail,
          status: "Paid",
          senderAddress: {
            street: loadedInvoice.senderAddress.street,
            city: loadedInvoice.senderAddress.city,
            postCode: loadedInvoice.senderAddress.postCode,
            country: loadedInvoice.senderAddress.country,
          },
          clientAddress: {
            street: loadedInvoice.clientAddress.street,
            city: loadedInvoice.clientAddress.city,
            postCode: loadedInvoice.clientAddress.postCode,
            country: loadedInvoice.clientAddress.country,
          },
          total: loadedInvoice.total,
        }),
        {
          "Content-Type": "application/json",
          authorization: "Bearer " + auth.user.token,
        }
      );
      navigate("/invoices");
    } catch (err) {}
  };

  // const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useContext(themeContext);

  //==========Table columns init==========
  const columns = [
    { title: "Item Name" },
    { title: "QTY." },
    { title: "Price" },
    { title: "Total" },
  ];

  return (
    <div className="wrapper" style={fade}>
      <Modal
        show={showConfirmModal}
        onCancel={closeConfirmModalHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button danger onClick={confirmDeleteHandler}>
              {isLoading ? "loading..." : "Delete"}
            </Button>
            <Button inverse onClick={closeConfirmModalHandler}>
              CANCEL
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this Invoice? Please note that it
          can't be undone.
        </p>
      </Modal>

      <button className="invoice__btn" onClick={() => navigate(-1)} id={theme}>
        Go back
      </button>
      {!loadedInvoice ? (
        <div className="center">
          <LoadingSpinner />
        </div>
      ) : (
        <animated.div className="invoice" style={fade}>
          <div className="invoice-header" id={theme}>
            <p className="invoice-header__status">
              <span className="accent-text">Status</span>
              <span className={`status ${loadedInvoice.status.toLowerCase()}`}>
                &#8226; {loadedInvoice.status}
              </span>
            </p>
            <div className="invoice-header__btn-wrapper">
              <Link
                to="edit"
                style={{ textDecoration: "none" }}
                state={{ background: location }}
              >
                <Button inverse>Edit</Button>
              </Link>
              <Button danger onClick={openConfirmModalHandler}>
                Delete
              </Button>
              {loadedInvoice.status === "Paid" ? null : (
                <Button onClick={markAsPaid}>
                  {isLoading ? "loading..." : "Mark as Paid"}
                </Button>
              )}
            </div>
          </div>
          <div className="content" id={theme}>
            <div className="content-head">
              <div className="content-head-title">
                <div className="content-head-title__description">
                  <p className="invoice-id">
                    <span>#</span>
                    {loadedInvoice.id.substring(0, 6)}
                  </p>
                  <p className="accent-text">{loadedInvoice.description}</p>
                </div>
                <div className="content-head-title__senderAddress accent-text">
                  <p>{loadedInvoice.senderAddress.street}</p>
                  <p>{loadedInvoice.senderAddress.city}</p>
                  <p>{loadedInvoice.senderAddress.postCode}</p>
                  <p>{loadedInvoice.senderAddress.country}</p>
                </div>
              </div>
            </div>
            <div className="content-main">
              <div className="content-main__date">
                <p className="accent-text">Invoice Date</p>
                <h3 className="invoice-date">{loadedInvoice.createdAt}</h3>
                <p className="accent-text">Payment Due</p>
                <h3 className="payment-due">{loadedInvoice.paymentDue}</h3>
              </div>
              <div className="content-main__billTo">
                <p className="accent-text">Bill To</p>
                <h3 className="">{loadedInvoice.clientName}</h3>
                <p className="accent-text">
                  {loadedInvoice.clientAddress.street}
                </p>
                <p className="accent-text">
                  {loadedInvoice.clientAddress.city}
                </p>
                <p className="accent-text">
                  {loadedInvoice.clientAddress.postCode}
                </p>
                <p className="accent-text">
                  {loadedInvoice.clientAddress.country}
                </p>
              </div>
              <div className="content-main__sentTo">
                <p className="accent-text">Sent To</p>
                <h3 className="">{loadedInvoice.clientEmail}</h3>
              </div>
            </div>
            <div className="content-sum" id={theme}>
              <div className="total-amount">
                <p className="accent-text">Total Amount</p>
                <h2>${loadedInvoice.total}</h2>
              </div>
            </div>
          </div>
          <div className="mobile-btn-wrapper">
            <Link
              to="edit"
              style={{ textDecoration: "none" }}
              state={{ background: location }}
            >
              <Button inverse>Edit</Button>
            </Link>
            <Button danger onClick={openConfirmModalHandler}>
              Delete
            </Button>
            {loadedInvoice.status === "Paid" ? null : (
              <Button onClick={markAsPaid}>
                {isLoading ? "loading..." : "Mark as Paid"}
              </Button>
            )}
          </div>
        </animated.div>
      )}
    </div>
  );
};

export default Invoice;
