import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import "../../styles/AuthStyles.css";

// Import react-datepicker
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [question, setQuestion] = useState(new Date()); // Updated to store a Date object
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/register`,
        { 
          name, 
          email, 
          password, 
          phone, 
          address, 
          question: question.toISOString() // Convert date to ISO string for backend
        }
      );

      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        navigate("/login");
      } 
      else {
        toast.error(res.data.message);
      }
    } 
    catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <Layout title={"Register ShopKart"}>
      <div className="form-container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
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
          {/* Replacing text input with DatePicker for 'question' */}
          <div className="mb-3">
            <label htmlFor="exampleInputQuestion">Security Question:</label>
            <DatePicker
              showIcon
              isClearable
              placeholderText="Enter new..."
              selected={question} // Bind selected date to state
              onChange={(date) => setQuestion(date)} // Update state on change
              dateFormat="dd/MM/yyyy" // Format displayed in the date picker
              className="form-control" // Add consistent styling
              required
            />
          </div>
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
