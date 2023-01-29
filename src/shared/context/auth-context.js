import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
});
