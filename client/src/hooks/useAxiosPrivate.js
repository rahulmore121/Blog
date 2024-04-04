import { axiosPrivate } from "../api/axios";
import { useSelector } from "react-redux";
import useRefreshToken from "./useRefreshToken";
import { useEffect } from "react";
const useAxiosPrivate = () => {
  const userdata = useSelector((state) => state.auth.userdata);
  console.log(userdata);
  const refresh = useRefreshToken();

  useEffect(() => {
    const requestInterceptor = axiosPrivate.interceptors.request.use(
      (config) => {
        console.log(config);
        if (
          !config.headers["Authorization"] ||
          !config.headers["authorization"]
        ) {
          config.headers["Authorization"] = `Bearer ${userdata}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    const responseInterceptor = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        console.log(error);
        const prevRequest = error?.config;
        console.log(prevRequest);
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestInterceptor);
      axiosPrivate.interceptors.response.eject(responseInterceptor);
    };
  }, [userdata, refresh]);
  return axiosPrivate;
};

export default useAxiosPrivate;
