import { createContext, useContext, useEffect, useState } from "react";
import { checkUserAuthStatusAPI } from "../apis/users/usersAPI";
import { useQuery } from "@tanstack/react-query";

// central place to store authrozied user
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  //Make Request using react query
  const { isError, isLoading, data, isSuccess } = useQuery({
    queryFn: checkUserAuthStatusAPI,
    queryKey: ["checkAuth"],
  });
  //updat the authentcated user
  useEffect(() => {
    if (isSuccess) {
      setAuthenticated(data);
    }
  }, [data, isSuccess]);

  const login = () => {
    setAuthenticated(true);
  };
  const logout = () => {
    setAuthenticated(false);
  };
  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isError, isLoading, isSuccess, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

//customer hook
export const useAuth = () => {
  return useContext(AuthContext);
};
