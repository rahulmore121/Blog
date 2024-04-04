import { useState } from "react";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import bgImg from "/assets/background.jpg";
import.meta.env;
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/authSlice";
import axios from "../../api/axios";
const Login = () => {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.auth);
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();
  console.log(status);
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!data.email || !data.password) {
      setError(true);
      setErrorMsg("All Fields are required");
      return;
    }
    try {
      let userData = await axios.post(
        "/api/v1/auth/signin",
        JSON.stringify(data),
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
          withCredentials: true,
        }
      );
      // const response = await fetch(
      //   `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/signin`,
      //   {
      //     method: "POST",
      //     headers: {
      //       Accept: "application/json",
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify(data),
      //   }
      // );
      // let userData = await response.json();
      // if (!response.ok) {
      //   setError(true);
      //   setErrorMsg(userData.message);
      //   return;
      // }
      dispatch(login(userData.data.data));
      localStorage.setItem("logged", true);
      // dispatch(togglePersist());
      setData({ name: "", email: "", password: "" });
      setError(false);
      setErrorMsg(null);
      navigate("/allposts", { replace: true });
    } catch (error) {
      console.log(error);
      setError(true);
      setErrorMsg(error.response.data.message);
    }
  };
  return (
    <div className="signup-main">
      <div className="sign-section">
        <div className="sign-left">
          <img src={bgImg} alt="" />
        </div>
        <div className="sign-right">
          <form onSubmit={onSubmitHandler} className="sign-menu">
            <p>Login</p>

            <input
              type="text"
              name="email"
              id="email"
              autoComplete="off"
              placeholder="Enter email"
              value={data.email}
              onChange={(e) => {
                setData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }));
              }}
            />

            <input
              type="password"
              name="password"
              id="password"
              autoComplete="off"
              placeholder="Enter password"
              value={data.password}
              onChange={(e) => {
                setData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }));
              }}
            />
            <div className="link-btn">
              <p>
                Already have an account?{" "}
                <Link to="/register" replace="true">
                  sign up
                </Link>
              </p>
              <button className="sign-button" type="submit">
                Login
              </button>
            </div>
            <div className="error">{error ? errorMsg : null}</div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
