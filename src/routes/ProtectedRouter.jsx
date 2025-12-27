import { Navigate } from "react-router-dom";

const ProtectedRouter = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <div>{children}</div>;
};

export default ProtectedRouter;
