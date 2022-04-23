import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  // Local Storage: setting & getting data
  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth"));

    if (auth) {
      setAuth(auth);
      console.log(auth);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
