import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const auth = localStorage.getItem("userToken");
  return auth ? <Outlet /> : <Navigate to="/login?nologin=1" />;
};

export default PrivateRoute;
