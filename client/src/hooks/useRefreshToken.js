import axios from "../api/axios";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
const useRefreshToken = () => {
  const dispatch = useDispatch();
  const refresh = async () => {
    const response = await axios.get("/api/v1/auth/refresh", {
      withCredentials: true,
    });
    dispatch(login(response.data.data));
    console.log(response.data.data);
    return response.data.data;
  };

  return refresh;
};

export default useRefreshToken;
