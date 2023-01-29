import React, { useEffect, useReducer } from "react";
import "./Input.css";
import { validate } from "../../util/validators";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case "TOUCH":
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state;
  }
};

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || "",
    isValid: props.initialValid || false,
    isTouched: false,
  });

  const changeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators,
    });
  };
  const touchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  // =======================element logic start=================================
  let element;
  switch (props.element) {
    case "input":
      element = (
        <input
          id={props.id}
          type={props.type}
          onChange={changeHandler}
          onBlur={touchHandler}
          value={inputState.value}
        />
      );
      break;
    case "select":
      element = (
        <select name="Payment Terms" id="Terms">
          <option selected value>
            Net 30 Days
          </option>
          <option value="Net 14 Day">Net 14 Days</option>
          <option value="Net 7 Days">Net 7 Days</option>
          <option value="Net 1 Days">Net 1 Days</option>
        </select>
      );
      break;
    default:
      element = (
        <input
          id={props.id}
          type={props.type}
          onChange={changeHandler}
          onBlur={touchHandler}
          value={inputState.value}
        />
      );
  }
  // =======================element logic end=================================

  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && "form-control--invalid"
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
