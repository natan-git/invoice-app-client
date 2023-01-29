import React, { useContext, useState } from "react";
import "./NewInvoice.css";
import { AuthContext } from "../../shared/context/auth-context";
import { useNavigate, useLocation } from "react-router-dom";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Button from "../../shared/components/UIElements/Button";
import Input from "../../shared/components/formElements/Input";
import Backdrop from "../../shared/components/UIElements/Backdrop";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import closeIcon from "../../assets/icon-arrow-left.svg";
import { themeContext } from "../../App";
import { useSpring, animated } from "react-spring";

const NewInvoice = (props) => {
  const slide = useSpring({
    from: { opacity: 0, x: -500 },
    to: { opacity: 1, x: 0 },
  });

  const { theme } = useContext(themeContext);
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [isDraft, setIsDraft] = useState(false);
  const navigate = useNavigate();

  const [formState, inputHandler] = useForm(
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

  const submitHandler = async (event) => {
    event.preventDefault();
    // send data to the server
    console.log("auth", auth);
    console.log("formState", formState.inputs.createdAt.value);

    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/invoices",
        "POST",
        JSON.stringify({
          createdAt: isDraft
            ? formState.inputs.createdAt.value
              ? formState.inputs.createdAt.value
              : " "
            : formState.inputs.createdAt.value,
          paymentDue: isDraft
            ? formState.inputs.paymentDue.value
              ? formState.inputs.paymentDue.value
              : " "
            : formState.inputs.paymentDue.value,
          description: isDraft
            ? formState.inputs.description.value
              ? formState.inputs.description.value
              : " "
            : formState.inputs.description.value,
          paymentTerms: isDraft ? " " : "net 30 days",
          clientName: isDraft
            ? formState.inputs.clientName.value
              ? formState.inputs.clientName.value
              : " "
            : formState.inputs.clientName.value,
          clientEmail: isDraft
            ? formState.inputs.clientEmail.value
              ? formState.inputs.clientEmail.value
              : " "
            : formState.inputs.clientEmail.value,
          status: isDraft ? "Draft" : "Pending",
          senderAddress: {
            street: isDraft
              ? formState.inputs.senderStreet.value
                ? formState.inputs.senderStreet.value
                : " "
              : formState.inputs.senderStreet.value,
            city: isDraft
              ? formState.inputs.senderCity.value
                ? formState.inputs.senderCity.value
                : " "
              : formState.inputs.senderCity.value,
            postCode: isDraft
              ? formState.inputs.senderPostCode.value
                ? formState.inputs.senderPostCode.value
                : " "
              : formState.inputs.senderPostCode.value,
            country: isDraft
              ? formState.inputs.senderCountry.value
                ? formState.inputs.senderCountry.value
                : " "
              : formState.inputs.senderCountry.value,
          },
          clientAddress: {
            street: isDraft
              ? formState.inputs.clientStreet.value
                ? formState.inputs.clientStreet.value
                : " "
              : formState.inputs.clientStreet.value,
            city: isDraft
              ? formState.inputs.clientCity.value
                ? formState.inputs.clientCity.value
                : " "
              : formState.inputs.clientCity.value,
            postCode: isDraft
              ? formState.inputs.clientPostCode.value
                ? formState.inputs.clientPostCode.value
                : " "
              : formState.inputs.clientPostCode.value,
            country: isDraft ? " " : formState.inputs.clientCountry.value,
          },
          total: isDraft
            ? formState.inputs.total.value
              ? formState.inputs.total.value
              : " "
            : formState.inputs.total.value,
          creator: auth.user.userId,
        }),
        {
          "Content-Type": "application/json",
          authorization: "Bearer " + auth.user.token,
        }
      );
      // redirect the user =>>>>>>>>>>>>>>>>>>>
      navigate("/invoices");
    } catch (err) {}
  };

  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner asOverlay />}
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
        <h1>Create Invoice</h1>

        <form onSubmit={submitHandler} className={`form-wrapper ${theme}`}>
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
            />

            <Input
              id="clientEmail"
              element="input"
              type="text"
              label="Client's Email"
              validators={[VALIDATOR_REQUIRE()]}
              errorText={"Required"}
              onInput={inputHandler}
            />

            <Input
              id="clientStreet"
              element="input"
              type="text"
              label="Street Address"
              validators={[VALIDATOR_REQUIRE()]}
              errorText={"Required"}
              onInput={inputHandler}
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
              />
              <Input
                id="clientPostCode"
                element="input"
                type="text"
                label="Post Code"
                validators={[VALIDATOR_REQUIRE()]}
                errorText={"Required"}
                onInput={inputHandler}
              />
              <Input
                id="clientCountry"
                element="input"
                type="text"
                label="Country"
                validators={[VALIDATOR_REQUIRE()]}
                errorText={"Required"}
                onInput={inputHandler}
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
            />
            <div className="date-row">
              <Input
                id="createdAt"
                element="input"
                type="date"
                label="created at"
                validators={[VALIDATOR_REQUIRE()]}
                errorText={"Required"}
                onInput={inputHandler}
              />
              <Input
                id="paymentDue"
                element="input"
                type="date"
                label="payment due"
                validators={[VALIDATOR_REQUIRE()]}
                errorText={"Required"}
                onInput={inputHandler}
              />
            </div>
            <Input
              id="total"
              element="input"
              type="text"
              label="Total"
              validators={[VALIDATOR_REQUIRE()]}
              errorText={"Required"}
              onInput={inputHandler}
            />
          </div>
          <div className="submit-box">
            <Button type="submit" disabled={!formState.isValid}>
              Save & Send
            </Button>
            <Button type="submit" onClick={() => setIsDraft(true)}>
              Draft
            </Button>
          </div>
        </form>
      </animated.section>
    </React.Fragment>
  );
};

export default NewInvoice;
