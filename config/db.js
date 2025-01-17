import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `Connected to MongoDB Database: ${con.connection.host}`.bgMagenta.white
    );
  } 
  catch (error) {
    console.error(`Error in MongoDB: ${error.message}`.bgRed.white);
    process.exit(1);
  }
};

export default connectDB;
