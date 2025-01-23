import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import "../../styles/AuthStyles.css";
import Layout from "./../../components/Layout/Layout";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const location = useLocation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/login`,
        { email, password }
      );

      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        
        setAuth({ 
          ...auth, 
          user: res.data.user, 
          token: res.data.token 
        });

        localStorage.setItem("auth", JSON.stringify(res.data));

        navigate(location.state || "/");
      } 
      else {
        toast.error(res.data.message);
      }
    } 
    catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Something went wrong!");
    }
  };

  return (
    <Layout title={"Login to ShopKart"}>
      <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          {/* email */}
          <div className="mb-3">
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              className="form-control"
              id="exampleInputEmail"
              placeholder="Enter Your Email..."
              required
            />
          </div>
          {/* password */}
          <div className="mb-3">
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="form-control"
              id="exampleInputPassword"
              placeholder="Enter Your Password..."
              required
            />
          </div>
          {/* Forgot-password */}
          <div className="mb-3 d-flex justify-content-center">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password
            </button>
          </div>
          { /* submit */}
          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary submit-btn">
              Submit
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
