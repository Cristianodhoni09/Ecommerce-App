import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Select } from "antd"; // It is used to select from a dropdown list
const { Option } = Select; //It represents the individual items in droopdown list

const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState("");

  //get all category
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/category/get-category`);
      if (data?.success) {
        setCategories(data?.category);
      }
    } 
    catch (error) {
      console.log(error);
      toast.error("Something went wrong in fetching categories!!");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  //create product function
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      productData.append("photo", photo);
      productData.append("category", category);
      const { data } = axios.post(
        `${process.env.REACT_APP_API}/api/v1/product/create-product`,
        productData
      );
      if (data?.success) {
        toast.error(data?.message);
      } 
      else {
        toast.success("Product Created Successfully");
        navigate("/dashboard/admin/products");
      }
    } 
    catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
  };

  return (
    <Layout title={"Dashboard - Create Product"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          {/* Admin Menu on left*/}
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Create Product</h1>
            <div className="m-1 w-75">
              {/* For category selection from the dropdown */}
              <Select
                bordered={false} // removes border in search bar
                placeholder="Select a category"
                size="large" // size of the box
                allowClear
                filterOption={(input, option) => {
                  // Enable filtering by category name based on the user input
                  return option.children.toLowerCase().includes(input.toLowerCase());
                }}
                showSearch // Show search input
                className="form-select mb-3"
                onChange={(value) => { //value and not 'e' because it is feature of ant design
                  setCategory(value);
                }}
              >
                {categories?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
              {/* For uploading product photo */}
              <div className="mb-3">
                <label className="btn btn-outline-secondary col-md-12">
                  {photo ? photo.name : "Upload Photo"}
                  <input
                    type="file"
                    name="photo"
                    accept="image/*" //* means any type of image
                    onChange={(e) => setPhoto(e.target.files[0])}
                    hidden // hidden so that it doesn't show up in the browser
                  />
                </label>
              </div>
              {/* To preview the photo */}
              <div className="mb-3">
                {photo && (
                  <div className="text-center">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="product_photo"
                      height={"200px"}
                      className="img img-responsive"
                    />
                  </div>
                )}
              </div>
              {/* Input field for name of the product */}
              <div className="mb-3">
                <input
                  type="text"
                  value={name}
                  placeholder="write a name..."
                  className="form-control"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              {/* Text area for product description */}
              <div className="mb-3">
                <textarea
                  type="text"
                  value={description}
                  placeholder="write a description..."
                  className="form-control"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
                {/* Input field for price of the product */}
              <div className="mb-3">
                <input
                  type="number"
                  value={price}
                  placeholder="write the Price..."
                  className="form-control"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              {/* Input field for quantity of the product */}
              <div className="mb-3">
                <input
                  type="number"
                  value={quantity}
                  placeholder="write a quantity..."
                  className="form-control"
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              {/* For shipping selection from dropdown */}
              <div className="mb-3">
                <Select
                  bordered={false}
                  placeholder="Select Shipping "
                  size="large"
                  showSearch
                  allowClear
                  className="form-select mb-3"
                  onChange={(value) => {
                    setShipping(value);
                  }}
                >
                  <Option value="0">No</Option>
                  <Option value="1">Yes</Option>
                </Select>
              </div>
              {/* Button to submit the form */}
              <div className="mb-3">
                <button className="btn btn-primary" onClick={handleCreate}>
                  ADD
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;