import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.ObjectId, //getting the id of category created
      ref: "Category", //Name we have kept in catogery schema
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    photo: {
      data: Buffer, //Photo from mongodb, not from cloudinary/aws
      contentType: String, //To specify what is the file type here .....(Here an image)
    },
    shipping: {
      type: Boolean, //To show order status
    },
  },
  { timestamps: true }
);

export default mongoose.model("Products", productSchema);