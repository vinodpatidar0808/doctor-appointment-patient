import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = JSON.parse(localStorage.getItem("authToken"));
  return token ? <Outlet /> : <Navigate to="/" />;
};
export default PrivateRoute;
