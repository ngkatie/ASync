import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "@firebase/auth";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    let listener = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoadingUser(false);
    });

    return () => {
      if (listener) listener();
    };
  }, []);

  if (loadingUser) {
    return <>Loading...</>;
  } else {
    return (
      <AuthContext.Provider value={{ currentUser }}>
        {children}
      </AuthContext.Provider>
    );
  }
};
