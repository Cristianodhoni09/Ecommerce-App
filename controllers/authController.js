import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, question } = req.body;
    //validations
    if (!name) {
      return res.send({ message: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (!phone) {
      return res.send({ message: "Phone no is Required" });
    }
    if (!address) {
      return res.send({ message: "Address is Required" });
    }
    if (!question) {
      return res.send({ message: "Security question is Required!" });
    }

    //check user
    const exisitingUser = await userModel.findOne({ email });
    //exisiting user
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Registered, please login!",
      });
    }
    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      question: new Date(question)
    }).save();

    res.status(201).send({
      success: true,
      message: "User Registered Successfully!",
      user,
    });
  } 
  catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};

//POST LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Invalid email or password!",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password!",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password!",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d"});

    //formatted question/DOB
    const formattedDate = new Date(user.question).toLocaleDateString("en-US"); // Format: MM/DD/YYYY

    res.status(200).send({
      success: true,
      message: "Logged in successfully!",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        question: formattedDate,
        role: user.role
      },
      token,
    });
  } 
  catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login!",
      error,
    });
  }
};

//test controller
export const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

//Forgot Password
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, question, password } = req.body;
    if (!email) res.status(400).send({ message: "Email is required!" });
    if (!question)
      res.status(400).send({
        message: "Security Question should be answered and can't be left empty",
      });
    if (!password)
      res.status(400).send({ message: `New Password can't be blank!` });

    // check
    const user = await userModel.findOne({ email, question });
    console.log(user);

    // validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email or Security Answer",
      });
    }

    const hashed = await hashPassword(password);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully!",
    });
  } 
  catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};