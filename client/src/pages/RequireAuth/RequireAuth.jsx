import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
const RequireAuth = () => {
  const { status, userdata } = useSelector((state) => state.auth);
  return status && userdata ? <Outlet /> : <Navigate to={"/"} replace="true" />;
};

export default RequireAuth;
