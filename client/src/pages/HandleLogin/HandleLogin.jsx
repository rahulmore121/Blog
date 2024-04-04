import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
const HandleLogin = () => {
  const { userdata, persist } = useSelector((state) => state.auth);

  return persist && !userdata ? (
    <Outlet />
  ) : (
    <Navigate to={"/allposts"} replace="true" />
  );
};

export default HandleLogin;
