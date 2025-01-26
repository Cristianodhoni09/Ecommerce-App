import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import "../../styles/AuthStyles.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [question, setQuestion] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission/refresh on submission
    try {
      /*
      If below path don't work then define proxy in package.json and give url of backend(same which is given in .env)
       - And use as: axios.post('/api/auth/register', {all data}) 
      */
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/register`,
        { 
          name, 
          email, 
          password, 
          phone, 
          address, 
          question
        }
      );

      if(res && res.data.success){ //These are sent in backend (authController.js)
        toast.success(res.data && res.data.message);
        navigate("/login");
      } 
      else{
        toast.error(res.data.message);
      }
    } 
    catch(error){
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <Layout title={"Register ShopKart"}>
      <div className="form-container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-3">
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="form-control"
              id="exampleInputName"
              placeholder="Enter Your Name..."
              required
            />
          </div>
          {/* Email */}
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
          {/* Password */}
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
          {/* Phone */}
          <div className="mb-3">
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              type="text"
              className="form-control"
              id="exampleInputPhone"
              placeholder="Enter Your Phone No..."
              required
            />
          </div>
          {/* Address */}
          <div className="mb-3">
            <input
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              type="text"
              className="form-control"
              id="exampleInputAddress"
              placeholder="Enter Your Address..."
              required
            />
          </div>
          {/* Security question */}
          <div className="mb-3">
            <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="form-control"
                id="exampleInputEmail1"
                placeholder="Enter any text that you will remember..."
                required
            />
          </div>
          {/* Submit Button */}
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

export default Register;
