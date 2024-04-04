import Footer from "../Footer/Footer";
import NavBar from "../NavBar/NavBar";
import { Outlet } from "react-router-dom";
import "./Layout.css";
const Layout = () => {
  return (
    <main className="main">
      <NavBar />
      <Outlet />
      <Footer />
    </main>
  );
};

export default Layout;
