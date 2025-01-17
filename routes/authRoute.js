import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

// Create a router object
const router = express.Router();

// Define routes
// REGISTER || METHOD POST
router.post("/register", registerController);

// LOGIN || POST
router.post("/login", loginController);

//Forgot Password || POST
router.post("/forgot-password", forgotPasswordController);

// TEST ROUTES
// Protected test route
router.get("/test", requireSignIn, isAdmin, testController);

// Protected Route For User
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

// Protected Route For Admin
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

// Add a route for handling 404 errors
router.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Export the router
export default router;
