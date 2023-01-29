import React, { useState, useContext } from "react";
import Profile from "./Profile";
import Input from "../../shared/components/formElements/Input";
import Button from "../../shared/components/UIElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import Spinner from "../../shared/components/UIElements/LoadingSpinner";
import { redirect } from "react-router-dom";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { themeContext } from "../../App";
import "./Auth.css";

const Auth = () => {
  const auth = useContext(AuthContext);
  const { theme } = useContext(themeContext);
  const [userInfo, setUserInfo] = useState();
  const [isLoginMode, setIsLoginMode] = useState(true);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    // send data to the server

    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          { "Content-Type": "application/json" }
        );
        auth.login(responseData, responseData.token);

        auth.user(responseData);

        setUserInfo(responseData);
      } catch (err) {}
    } else {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/signup",
          "POST",
          JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          { "Content-Type": "application/json" }
        );

        auth.login(responseData, responseData.token);

        auth.user(responseData);

        setUserInfo(responseData);
      } catch (err) {}
    }
    redirect("/");
  };

  const authLogout = () => {
    auth.logout();
  };
  const errorHandler = () => {
    clearError();
  };
  // loginAsGuest start
  const loginAsGuest = async () => {
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/users/login",
        "POST",
        JSON.stringify({
          email: "Guest@gmail.com",
          password: "121212",
        }),
        { "Content-Type": "application/json" }
      );
      auth.login(responseData, responseData.token);

      auth.user(responseData);

      setUserInfo(responseData);
    } catch (err) {}
    redirect("/invoices");
  };

  // loginAsGuest end

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorHandler} />
      <div className="auth-page">
        {auth.isLoggedIn ? (
          <Profile user={userInfo} logout={authLogout} />
        ) : (
          <div className="form-container" id={theme}>
            {isLoading && <Spinner asOverlay />}
            <div className="form-header">
              <h1>Invoice App</h1>
              <p>
                Discover the world's lightest tool for freelancers and business
                owners.
              </p>
            </div>
            <h2>{isLoginMode ? " Login" : " Signup"}</h2>
            <form onSubmit={authSubmitHandler}>
              {!isLoginMode && (
                <Input
                  onInput={inputHandler}
                  id="name"
                  type="text"
                  element="input"
                  label="Full Name"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Require"
                />
              )}
              <Input
                onInput={inputHandler}
                id="email"
                type="email"
                element="input"
                label="Email"
                validators={[VALIDATOR_EMAIL()]}
                errorText="Please enter valid email address"
              />
              <Input
                onInput={inputHandler}
                id="password"
                type="password"
                element="input"
                label="Password"
                validators={[VALIDATOR_MINLENGTH(6)]}
                errorText="Please enter valid password, at leas5 6 characters"
              />
              <Button type="submit" disabled={!formState.isValid}>
                {isLoginMode ? "Login" : "signup"}
              </Button>
            </form>
            <button className="login-as-guest-btn" onClick={loginAsGuest}>
              Login as guest
            </button>
            <p className="switch-mode">
              {isLoginMode ? `Don't have an account?` : `Have an account?`}
              <span onClick={switchModeHandler}>
                {isLoginMode ? " Signup" : " Login"}
              </span>
            </p>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default Auth;

// WITH NO HTTP HOOK ⬇️

// const Auth = () => {
//   const auth = useContext(AuthContext);

//   const [isLoginMode, setIsLoginMode] = useState(true);

//   const [isLoading, setIsLoading] = useState(false);

//   const [error, setError] = useState(null);

//   const [formState, inputHandler, setFormData] = useForm(
//     {
//       email: {
//         value: "",
//         isValid: false,
//       },
//       password: {
//         value: "",
//         isValid: false,
//       },
//     },
//     false
//   );

//   const switchModeHandler = () => {
//     if (!isLoginMode) {
//       setFormData(
//         {
//           ...formState.inputs,
//           name: undefined,
//         },
//         formState.inputs.email.isValid && formState.inputs.password.isValid
//       );
//     } else {
//       setFormData(
//         {
//           ...formState.inputs,
//           name: {
//             value: "",
//             isValid: false,
//           },
//         },
//         false
//       );
//     }
//     setIsLoginMode((prevMode) => !prevMode);
//   };

//   const authSubmitHandler = async (event) => {
//     event.preventDefault();
//     // send data to the server

//     setIsLoading(true);

//     if (isLoginMode) {
//       try {
//         const response = await fetch("http://localhost:5002/api/users/login", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             email: formState.inputs.email.value,
//             password: formState.inputs.password.value,
//           }),
//         });

//         const responseData = await response.json();
//         if (!response.ok) {
//           // runs if we have some 400 || 500 codes error
//           throw new Error(responseData.message);
//         }

//         setIsLoading(false);

//         auth.login();
//       } catch (err) {
//         setIsLoading(false);
//         setError(err.message || "something went wrong, please try again");
//       }
//     } else {
//       try {
//         const response = await fetch("http://localhost:5002/api/users/signup", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             name: formState.inputs.name.value,
//             email: formState.inputs.email.value,
//             password: formState.inputs.password.value,
//           }),
//         });

//         const responseData = await response.json();
//         if (!response.ok) {
//           // runs if we have some 400 || 500 codes error
//           throw new Error(responseData.message);
//         }

//         setIsLoading(false);

//         auth.login();
//       } catch (err) {
//         setIsLoading(false);
//         setError(err.message || "something went wrong, please try again");
//       }
//     }
//   };

//   const authLogout = () => {
//     auth.logout();
//   };
//   const errorHandler = () => {
//     setError(null);
//   };
//   return (
//     <React.Fragment>
//       <ErrorModal error={error} onClear={errorHandler} />
//       <div className="auth-page">
//         {auth.isLoggedIn ? (
//           <div>
//             <h2>You Are Logged in</h2>
//             <Button onClick={authLogout}>Logout</Button>
//           </div>
//         ) : (
//           <div className="form-container">
//             {isLoading && <Spinner asOverlay />}
//             <div className="form-header">
//               <h1>Invoice App</h1>
//               <p>
//                 Discover the world's lightest tool for freelancers and business
//                 owners.
//               </p>
//             </div>
//             <h2>{isLoginMode ? " Login" : " Signup"}</h2>
//             <form onSubmit={authSubmitHandler}>
//               {!isLoginMode && (
//                 <Input
//                   onInput={inputHandler}
//                   id="name"
//                   type="text"
//                   element="input"
//                   label="Full Name"
//                   validators={[VALIDATOR_REQUIRE()]}
//                   errorText="Require"
//                 />
//               )}
//               <Input
//                 onInput={inputHandler}
//                 id="email"
//                 type="email"
//                 element="input"
//                 label="Email"
//                 validators={[VALIDATOR_EMAIL()]}
//                 errorText="Please enter valid email address"
//               />
//               <Input
//                 onInput={inputHandler}
//                 id="password"
//                 type="password"
//                 element="input"
//                 label="Password"
//                 validators={[VALIDATOR_MINLENGTH(5)]}
//                 errorText="Please enter valid password, at leas5 5 characters"
//               />
//               <Button type="submit" disabled={!formState.isValid}>
//                 {isLoginMode ? "Login" : "signup"}
//               </Button>
//             </form>
//             <p className="switch-mode">
//               {isLoginMode ? `Don't have an account?` : `Have an account?`}
//               <span onClick={switchModeHandler}>
//                 {isLoginMode ? " Signup" : " Login"}
//               </span>
//             </p>
//           </div>
//         )}
//       </div>
//     </React.Fragment>
//   );
// };

// export default Auth;
