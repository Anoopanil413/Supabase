import { Navigate, Outlet } from "react-router-dom";
import Layouts from "./Layout";

const Protected = () => {
  const token = sessionStorage.getItem("token");

  return token ? <Layouts /> : <Navigate to="/signin" />;
};

export default Protected;