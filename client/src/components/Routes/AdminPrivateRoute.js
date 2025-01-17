import axios from "axios";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/auth";
import Spinner from "../Spinner";

export const AdminPrivateRoute = () => {
  const [ok, setOk] = useState(false);
  const [auth, setAuth] = useAuth();

  //   default axios
  axios.defaults.headers.common["Authorization"] = auth?.token;

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/auth/admin-auth`
        )
        .catch((error) => {
          if (!error.response) {
            alert("The server is down. Please try again later.");
          }
        });
        
        if (res.data.ok) {
          setOk(true);
        } 
        else {
          setOk(false);
        }
      } 
      catch (error) {
        console.log(error);
        setOk(false);
      }
    };
    
    if (auth?.token) authCheck();
  }, [auth?.token]);

  return ok ? <Outlet /> : <Spinner path="/" />;
};
