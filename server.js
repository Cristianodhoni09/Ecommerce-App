// Importing necessary modules
import express from "express"; // Express framework for building web applications
import colors from "colors"; // Colors module for coloring console output
import dotenv from "dotenv"; // dotenv for loading environment variables
import morgan from "morgan"; // Morgan for logging HTTP requests
import connectDB from "./config/db.js"; // Database connection configuration
import authRoutes from "./routes/authRoute.js"; // Authentication routes
import cors from "cors";
import categoryRoutes from "./routes/categoryRoutes.js"
import productRoutes from "./routes/productRoutes.js"

// Configure environment variables from .env file
dotenv.config(); //path is root so no need to mention

// Connecting to the database
connectDB();

// Creating an instance of the Express application
const app = express();

// Middleware setup
/*Cors allows the frontend and backend to be hosted on different domains or ports during development or production, 
while still allowing communication between them*/
app.use(cors()); // cors package simplifies handling cross-origin requests in a secure manner
app.use(express.json()); // Parse incoming JSON requests
app.use(morgan("dev")); // Log HTTP requests in development mode

// Set up routes for authentication
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);

// Root route for the application
app.get("/", (req, res) => {
  res.send("<h1>Welcome to ecommerce app</h1>"); // Send welcome message
});

// Error handling middleware for 404 Not Found
app.use((req, res, next) => {
  const error = new Error("Not found"); // Create a new error
  error.status = 404; // Set error status to 404
  next(error); // Pass the error to the next middleware
});

// General error handling middleware
app.use((error, req, res, next) => {
  res.status(error.status || 500); // Set response status
  res.send({
    error: {
      status: error.status || 500, // Include error status
      message: error.message || "Internal Server Error", // Include error message
    },
  });
});

// Define the port for the server to listen on
const PORT = process.env.PORT || 7000; // Use PORT from environment or default to 7000

// Start the server and listen for incoming requests
app.listen(PORT, (err) => {
  if (err) {
    console.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  }
  console.log(
    `Server Running on ${process.env.NODE_ENV || "development"} mode on port ${PORT}`.bgGreen.white
  ); // Log server start message
});