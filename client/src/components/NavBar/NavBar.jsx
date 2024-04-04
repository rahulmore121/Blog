import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import axios from "../../api/axios";
const NavBar = () => {
  const { status } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logoutHandler = async () => {
    await axios.get("/api/v1/auth/logout", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
      withCredentials: true,
    });
    dispatch(logout());
    // dispatch(togglePersist());
    localStorage.setItem("logged", undefined);
    navigate("/", { replace: true });
  };
  return (
    <div className="nav-main">
      <div className="nav-bar">
        <div className="logo">My Blog</div>
        <div>search bar</div>
        <div className="nav-menu">
          {status ? (
            <>
              <div>
                <Link to="/allposts">Home</Link>
              </div>
              <div>
                <Link to="/posts">Posts</Link>
              </div>
              <div>
                <div onClick={logoutHandler}>Logout</div>
              </div>
              <div>Profile</div>
            </>
          ) : (
            <>
              <div>
                <Link to="register" replace="true">
                  Signup
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
