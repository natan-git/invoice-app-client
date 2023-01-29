import React, { createContext, useState, useCallback, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AuthContext } from "./shared/context/auth-context";
import data from "./data.json";
import SideNav from "./shared/components/navigation/SideNav";
import UserInvoices from "./invoices/pages/UserInvoices";
import NewInvoice from "./invoices/pages/NewInvoice";
import UpdateInvoice from "./invoices/pages/UpdateInvoice";
import Invoice from "./invoice/pages/Invoice";
import Auth from "./user/pages/Auth";
import Chat from "./user/pages/Chat";
import NotFound from "./user/pages/NotFound";

export const themeContext = createContext(null);

const App = () => {
  const location = useLocation();
  const background = location.state && location.state.background;

  const [theme, setTheme] = useState("light");
  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = useCallback((user, token) => {
    console.log(user);
    localStorage.setItem("userData", JSON.stringify(user, token));
    setIsLoggedIn(true);
    setToken(token);
    setUserId(user.userId);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setToken(null);
    setUserId(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.token) {
      setUser(storedData);
      setIsLoggedIn(true);
    }
  }, []); // runs only ones

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        userId: userId,
        user: user,
        token: token,
        login: login,
        logout: logout,
      }}
    >
      <themeContext.Provider value={{ theme, toggleTheme }}>
        <div className="app" id={theme}>
          <SideNav />
          <main>
            <Routes location={background || location}>
              <Route path="/invoices" element={<UserInvoices />}>
                <Route exact path="/invoices/new" element={<NewInvoice />} />
              </Route>

              <Route path="/invoices/:invoiceId" element={<Invoice />}>
                <Route
                  path="/invoices/:invoiceId/edit"
                  element={<UpdateInvoice />}
                />
              </Route>
              <Route path="/" element={<Auth />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            {background && (
              <Routes>
                <Route exact path="/invoices/new" element={<NewInvoice />} />
                <Route
                  path="/invoices/:invoiceId/edit"
                  element={<UpdateInvoice />}
                />
              </Routes>
            )}
          </main>
          {/* <main>
            <Routes>
              <Route path="/invoices" element={<UserInvoices />} />
              <Route path="/invoices/new" element={<NewInvoice />} />

              <Route path="/invoices/:invoiceId" element={<Invoice />} />
              <Route
                path="/invoices/:invoiceId/edit"
                element={<UpdateInvoice />}
              />

              <Route path="/" element={<Auth />} />

              <Route path="/chat" element={<Chat />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main> */}
        </div>
      </themeContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
