import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import useRefreshToken from "../../hooks/useRefreshToken";
import { useEffect } from "react";
import { useState } from "react";
const PersistUser = () => {
  const { userdata, persist } = useSelector((state) => state.auth);
  const refresh = useRefreshToken();
  const [isloading, setIsloading] = useState(true);

  useEffect(() => {
    const verfiyRefreshToken = async () => {
      console.log("inside verify toekns");
      try {
        setIsloading(true);
        await refresh();
      } catch (error) {
        console.log(error);
      } finally {
        setIsloading(false);
      }
    };
    !userdata && persist ? verfiyRefreshToken() : setIsloading(false);
  }, []);
  useEffect(() => {
    console.log("isloading", isloading);
    console.log("userdata", userdata, persist);
  }, [isloading]);

  return !persist ? <Outlet /> : isloading ? <h1>Loading ...</h1> : <Outlet />;
};

export default PersistUser;
