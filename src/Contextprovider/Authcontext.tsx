import { createContext, ReactNode, useContext, useState } from "react";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }:any) => {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ user,setUser }}>
        {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;