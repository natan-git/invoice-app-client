import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../shared/components/formElements/Input";
import Button from "../../shared/components/UIElements/Button";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import closeIcon from "../../assets/icon-arrow-left.svg";
import Backdrop from "../../shared/components/UIElements/Backdrop";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { themeContext } from "../../App";
import { AuthContext } from "../../shared/context/auth-context";
import { useSpring, animated } from "react-spring";

import "./NewInvoice.css";

const UpdateInvoice = (props) => {
  const slide = useSpring({
    from: { opacity: 0, x: -500 },
    to: { opacity: 1, x: 0 },
  });
  const { theme } = useContext(themeContext);
  const auth = useContext(AuthContext);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [loadedInvoice, setLoadedInvoice] = useState();

  const navigate = useNavigate();

  const invoiceId = useParams().invoiceId;

  const [formState, inputHandler, setFormData] = useForm(
    {
      // Sender info
      senderStreet: {
        value: "",
        isValid: false,
      },
      senderCity: {
        value: "",
        isValid: false,
      },
      senderPostCode: {
        value: "",
        isValid: false,
      },
      senderCountry: {
        value: "",
        isValid: false,
      },
      // Client info
      clientName: {
        value: "",
        isValid: false,
      },
      clientEmail: {
        value: "",
        isValid: false,
      },
      clientStreet: {
        value: "",
        isValid: false,
      },
      clientCity: {
        value: "",
        isValid: false,
      },
      clientPostCode: {
        value: "",
        isValid: false,
      },
      clientCountry: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      createdAt: {
        value: "",
        isValid: false,
      },
      paymentDue: {
        value: "",
        isValid: false,
      },
      total: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  // const identifiedInvoice = data.find((invoice) => invoice.id === invoiceId);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/invoices/${invoiceId}`
        );
        setLoadedInvoice(responseData.invoice);
        console.log(responseData.invoice);
        setFormData(
          {
            // Sender info
            senderStreet: {
              value: responseData.invoice.senderAddress.street,
              isValid: true,
            },
            senderCity: {
              value: responseData.invoice.senderAddress.city,
              isValid: true,
            },
            senderPostCode: {
              value: responseData.invoice.senderAddress.postCode,
              isValid: true,
            },
            senderCountry: {
              value: responseData.invoice.senderAddress.country,
              isValid: true,
            },
            // Client info
            clientName: {
              value: responseData.invoice.clientName,
              isValid: true,
            },
            clientEmail: {
              value: responseData.invoice.clientEmail,
              isValid: true,
            },
            clientStreet: {
              value: responseData.invoice.clientAddress.street,
              isValid: true,
            },
            clientCity: {
              value: responseData.invoice.clientAddress.city,
              isValid: true,
            },
            clientPostCode: {
              value: responseData.invoice.clientAddress.postCode,
              isValid: true,
            },
            clientCountry: {
              value: responseData.invoice.clientAddress.country,
              isValid: true,
            },
            // project description
            description: {
              value: responseData.invoice.description,
              isValid: true,
            },
            createdAt: {
              value: responseData.invoice.createdAt,
              isValid: true,
            },
            paymentDue: {
              value: responseData.invoice.paymentDue,
              isValid: true,
            },
            total: {
              value: responseData.invoice.total,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };

    fetchInvoice();
  }, [invoiceId, setFormData]);

  const submitHandler = async (event) => {
    event.preventDefault();
    // send data to the server
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/invoices/${invoiceId}`,
        "PATCH",
        JSON.stringify({
          createdAt: formState.inputs.createdAt.value,
          paymentDue: formState.inputs.paymentDue.value,
          description: formState.inputs.description.value,
          paymentTerms: "net 30 days",
          clientName: formState.inputs.clientName.value,
          clientEmail: formState.inputs.clientEmail.value,
          status: "Pending",
          senderAddress: {
            street: formState.inputs.senderStreet.value,
            city: formState.inputs.senderCity.value,
            postCode: formState.inputs.senderPostCode.value,
            country: formState.inputs.senderCountry.value,
          },
          clientAddress: {
            street: formState.inputs.clientStreet.value,
            city: formState.inputs.clientCity.value,
            postCode: formState.inputs.clientPostCode.value,
            country: formState.inputs.clientCountry.value,
          },
          total: formState.inputs.total.value,
        }),
        {
          "Content-Type": "application/json",
          authorization: "Bearer " + auth.user.token,
        }
      );
      // redirect the user =>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<
      navigate("/invoices");
    } catch (err) {}
  };

  // Loading logic
  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  // error logic
  if (!loadedInvoice) {
    return (
      <div>
        <p>Could not find Invoice data, please try later</p>
      </div>
    );
  }
  console.log("form state before return", formState);
  return (
    <React.Fragment>
      {/* {isLoading && !error && <LoadingSpinner asOverlay />} */}
      <ErrorModal error={error} onClear={clearError} />
      <Backdrop onClick={() => navigate(-1)} />
      <img
        onClick={() => navigate(-1)}
        className="close-route-modal-btn"
        src={closeIcon}
      />
      <animated.section
        className={`invoice-form-wrapper ${theme}`}
        style={slide}
      >
        <button
          className="invoice__btn"
          onClick={() => navigate(-1)}
          id={theme}
        >
          ← Go back
        </button>
        <p>
          Edit
          <span>#{invoiceId.substring(0, 6)}</span>
        </p>
        {!isLoading && loadedInvoice && (
          <form onSubmit={submitHandler} className={`form-wrapper ${theme}`}>
            <h1>Update Invoice</h1>

            <div className="bill-from">
              <h6>Bill From</h6>
              <Input
                className="bill-from__address"
                id="senderStreet"
                element="input"
                type="text"
                label="Street Address"
                validators={[VALIDATOR_REQUIRE()]}
                errorText={"Required"}
                onInput={inputHandler}
                initialValue={loadedInvoice.senderAddress.street}
                initialValid={true}
              />
              <div className="input-row">
                <Input
                  className="bill-from__city"
                  id="senderCity"
                  element="input"
                  type="text"
                  label="City"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText={"Required"}
                  onInput={inputHandler}
                  initialValue={loadedInvoice.senderAddress.city}
                  initialValid={true}
                />
                <Input
                  className="bill-from__code"
                  id="senderPostCode"
                  element="input"
                  type="text"
                  label="Post Code"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText={"Required"}
                  onInput={inputHandler}
                  initialValue={loadedInvoice.senderAddress.postCode}
                  initialValid={true}
                />
                <Input
                  className="bill-from__country"
                  id="senderCountry"
                  element="input"
                  type="text"
                  label="Country"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText={"Required"}
                  onInput={inputHandler}
                  initialValue={loadedInvoice.senderAddress.country}
                  initialValid={true}
                />
              </div>
            </div>
            <div className="bill-to">
              {/* BILL TO */}
              <h6>Bill To</h6>
              <Input
                id="clientName"
                element="input"
                type="text"
                label="Client's Name"
                validators={[VALIDATOR_REQUIRE()]}
                errorText={"Required"}
                onInput={inputHandler}
                initialValue={loadedInvoice.clientName}
                initialValid={true}
              />
              <Input
                id="clientEmail"
                element="input"
                type="text"
                label="Client's Email"
                validators={[VALIDATOR_REQUIRE()]}
                errorText={"Required"}
                onInput={inputHandler}
                initialValue={loadedInvoice.clientEmail}
                initialValid={true}
              />
              <Input
                id="clientStreet"
                element="input"
                type="text"
                label="Street Address"
                validators={[VALIDATOR_REQUIRE()]}
                errorText={"Required"}
                onInput={inputHandler}
                initialValue={loadedInvoice.clientAddress.street}
                initialValid={true}
              />
              <div className="input-row">
                <Input
                  id="clientCity"
                  element="input"
                  type="text"
                  label="City"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText={"Required"}
                  onInput={inputHandler}
                  initialValue={loadedInvoice.clientAddress.city}
                  initialValid={true}
                />
                <Input
                  id="clientPostCode"
                  element="input"
                  type="text"
                  label="Post Code"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText={"Required"}
                  onInput={inputHandler}
                  initialValue={loadedInvoice.clientAddress.postCode}
                  initialValid={true}
                />
                <Input
                  id="clientCountry"
                  element="input"
                  type="text"
                  label="Country"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText={"Required"}
                  onInput={inputHandler}
                  initialValue={loadedInvoice.clientAddress.country}
                  initialValid={true}
                />
              </div>

              <Input
                id="description"
                element="input"
                type="text"
                label="Description"
                validators={[VALIDATOR_REQUIRE()]}
                errorText={"Required"}
                onInput={inputHandler}
                initialValue={loadedInvoice.description}
                initialValid={true}
              />
              <Input
                id="createdAt"
                element="input"
                type="date"
                label="created at"
                validators={[VALIDATOR_REQUIRE()]}
                errorText={"Required"}
                onInput={inputHandler}
                initialValue={loadedInvoice.createdAt}
                initialValid={true}
              />
              <Input
                id="paymentDue"
                element="input"
                type="date"
                label="payment due"
                validators={[VALIDATOR_REQUIRE()]}
                errorText={"Required"}
                onInput={inputHandler}
                initialValue={loadedInvoice.paymentDue}
                initialValid={true}
              />
              <Input
                id="total"
                element="input"
                type="text"
                label="Total"
                validators={[VALIDATOR_REQUIRE()]}
                errorText={"Required"}
                initialValue={loadedInvoice.total}
                onInput={inputHandler}
                initialValid={true}
              />
            </div>
            <Button type="submit" disabled={!formState.isValid}>
              Update
            </Button>
          </form>
        )}
      </animated.section>
    </React.Fragment>
  );
};

export default UpdateInvoice;
