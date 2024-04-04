import { useState } from "react";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import bgImg from "/assets/background.jpg";
import axios from "../../api/axios";
import.meta.env;
const Signup = () => {
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();
  const [img, setImg] = useState(null);
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!data.email || !data.name || !data.password || !img) {
      setError(true);
      setErrorMsg("All Fields are required");
      return;
    }
    const formdata = new FormData();
    formdata.append("avatar", img);
    formdata.append("name", data.name);
    formdata.append("email", data.email);
    formdata.append("password", data.password);
    try {
      const response = await axios.post(`/api/v1/auth/register`, formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
      navigate("/", { replace: true });
      setData({ name: "", email: "", password: "" });
      setError(false);
      setErrorMsg(null);
    } catch (error) {
      setError(true);
      setErrorMsg(error.message);
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
            <p>Sign up</p>
            <input
              type="text"
              name="name"
              id="name"
              autoComplete="off"
              placeholder="Enter name"
              value={data.name}
              onChange={(e) => {
                setData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }));
              }}
            />

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
            <input
              type="file"
              placeholder="Enter password"
              onChange={(e) => {
                setImg(e.target.files[0]);
              }}
            />
            <div className="link-btn">
              <p>
                Already have an account?{" "}
                <Link to="/" replace="true">
                  login
                </Link>
              </p>
              <button className="sign-button" type="submit">
                Sign up
              </button>
            </div>
            <div className="error">{error ? errorMsg : null}</div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
