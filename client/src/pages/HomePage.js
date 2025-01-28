import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";


const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checkedArr, setChecked] = useState([]); //Keeps track of selected category filters (array of category IDs)
  const [radio, setRadio] = useState([]); //Stores the selected price range for filtering
  const [total, setTotal] = useState(0); //Total number of products available
  const [page, setPage] = useState(1); //Current page for pagination (used to load more products)
  const [loading, setLoading] = useState(false); //Indicates whether a request is in progress
  
  /******************************get all category************************************* */
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
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // filter by category
  const handleFilter = (value, id) => {
    let all = [...checkedArr];
    if (value) {
      all.push(id);
    } 
    else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  /******************************get all products or only filtered products************************************* */
  //get all products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      //instead of getting from /get-product we used /product-list because the former will return all products without pagination
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts(data.products);
    } 
    catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  //get filtered product
  const filterProduct = async () => {
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/product-filters`, {
        checkedArr,
        radio,
      });
      setProducts(data?.products);
    } 
    catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (checkedArr.length === 0 &&  radio.length === 0) {
      getAllProducts(); //Call getAllProducts only when user have not applied any filter
    }
  }, [checkedArr.length, radio.length]);

  useEffect(() => {
    if (checkedArr.length > 0) {
      filterProduct(); //If user have applied filter on category then call filterProduct
    }
  }, [checkedArr.length]);

  useEffect(() => {
    if (radio.length > 0) {
      filterProduct(); //If user have applied filter on price then call filterProduct
    }
  }, [radio.length]);

  /* **********************Get total count of products ************************** */
  //get total Count
  const getTotal = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-count`);
      setTotal(data?.total);
    } 
    catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getTotal();
  }, []);

  
  //load more
  const loadMore = async () => {
    try {
      setLoading(true); //shows "Loading..." on the button
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`
      );
      setLoading(false); //shows "Loadmore..." written on the button
      setProducts([...products, ...data?.products]); //Appending more after loadMore is clicked
    } 
    catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);
  

  return (
    <Layout title={"!!Best offers!!"} description={"This is Home page"} author={"Amit"}>
      <div className="container-fluid row mt-3">
        <div className="col-md-2">
          {/* Filter by category */}
          <h4 className="text-center">Filter By Category</h4>
          <div className="d-flex flex-column">
            {categories?.map((c) => (
              <Checkbox
                key={c._id}
                onChange={(e) => handleFilter(e.target.checked, c._id)} //Boolean indicating whether the checkbox is checked or not and id as argument
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
          {/* Filter by Price */}
          <h4 className="text-center mt-4">Filter By Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices?.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          {/* Reset filter button */}
          <div className="d-flex flex-column">
              {/* <button
                className="btn btn-danger"
                onClick={() => {
                  setChecked([]);
                  setRadio([]);
                  getAllProducts();
                }}
              >
                RESET FILTERS
              </button> */}
              <button
                className="btn btn-danger"
                onClick={() => window.location.reload()}
              >
                RESET FILTERS
              </button>
          </div>
        </div>
        {/* All products on right */}
        <div className="col-md-9">
          <h1 className="text-center">All Products</h1>
          {/* Each item on a card with its photo, name, description, add to cart etc */}
          <div className="d-flex flex-wrap">
            {products?.map((p) => (
              <div className="card m-2" style={{ width: "18rem" }}>
                <img
                  src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">
                    {p.description.substring(0, 30)}...
                  </p>
                  <p className="card-text"> ₹ {p.price}</p>
                  <button class="btn btn-primary ms-1">More Details</button>
                  <button class="btn btn-secondary ms-1">Add to cart</button>
                </div>
              </div>
            ))}
          </div>
          {/* More products loading option */}
          <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn btn-warning"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? "Loading ..." : "Load More"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;