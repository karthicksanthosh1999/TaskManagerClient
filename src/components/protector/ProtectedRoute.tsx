import { FC, ReactNode, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute: FC<{ children: ReactNode }> = ({ children }) => {

  const { isAuthndicated } = useContext(AuthContext)
  console.log(isAuthndicated)
  if (!isAuthndicated) {
    return <Navigate to={'/'} />
  }
  return <>{children}</>;
};

export default ProtectedRoute;
