import axios from "axios";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/auth";
import Spinner from "../Spinner";

export const PrivateRoute = () => {
  const [ok, setOk] = useState(false);
  const [auth] = useAuth();

  //Default axios
  axios.defaults.headers.common["Authorization"] = auth?.token; // set token in header globally for all HTTP requests

  useEffect(() => {
    const authCheck = async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/auth/user-auth`
      )
      .catch((error) => {
        if (!error.response) {
          alert("The server is down. Please try again later.");
        }
      });
      
      if (res.data.ok) {
        setOk(true);
      } else {
        setOk(false);
      }
    };
    if (auth?.token) authCheck();
  }, [auth?.token]);

  //Outlet is a special component in react-router-dom that renders different child components of parent route
  return ok ? <Outlet /> : <Spinner path="/login"/>;
};
