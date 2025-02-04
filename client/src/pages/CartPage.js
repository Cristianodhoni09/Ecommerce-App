import React, { useEffect, useState } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";

import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/CartStyles.css"

const CartPage = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();
  const [clientToken, setClientToken] = useState(""); //To get token from BrainTree
  const [instance, setInstance] = useState(""); //Stores the BrainTree payment instance created by the DropIn component
  const [loading, setLoading] = useState(false);

  //total price
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map((item) => {
        total = total + item.price;
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "INR",
      });
    } catch (error) {
      console.log(error);
    }
  };
  //detele item
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } 
    catch (error) {
      console.log(error);
    }
  };

  //get payment gateway token
  const getToken = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/braintree/token`);
      setClientToken(data?.clientToken);
    } 
    catch (error) {
      console.log("Error in getting Braintree Token: ", error);
    }
  };

  useEffect(() => {
    getToken();
  }, [auth?.token]); //If logged In user then get token

  //Handle payments
  const handlePayment = async () => {
    try {
      setLoading(true);

      const { nonce } = await instance.requestPaymentMethod(); //BrainTree's method to request a secure payment token (nonce) after user input

      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/product/braintree/payment`,
        { nonce, cart },
        {
          headers: {
            Authorization: auth?.token, // Adding the token to the request headers
          },
        }
      );

      setLoading(false);

      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed Successfully!! ");
    } 
    catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Layout title={"Cart Page"}>
      <div className="container">
        {/* Displaying user's cart information */}
        <div className="row">
            <div className="col-md-12">
                <h1 className="text-center bg-light p-2 mb-1">
                {`Hello ${auth?.token && auth?.user?.name}`}
                </h1>
                <h4 className="text-center">
                    {cart?.length ? 
                        `You Have ${cart.length} items in your cart ${auth?.token ? "" : "-please login to checkout"}`
                        : " Your cart is empty, please add items to checkout"}
                </h4>
            </div>
        </div>
        <div className="row">
            {/* Display each products present in cart with remove button */}
            <div className="col-md-8">
                {cart?.map((p) => (
                <div className="row mb-2 p-3 card flex-row">
                    <div className="col-md-4">
                        <img
                            src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                            className="card-img-top"
                            alt={p.name}
                            width="100px"
                            height={"100px"}
                        />
                    </div>
                    <div className="col-md-8">
                        <p>{p.name}</p>
                        <p>{p.description.substring(0, 30)}...</p>
                        <p>Price : {p.price}</p>
                        <button
                            className="btn btn-danger"
                            onClick={() => removeCartItem(p._id)}
                        >
                            Remove
                        </button>
                    </div>
                </div>
                ))}
            </div>
            {/* Show total price, address, update address button etc */}
            <div className="col-md-4 text-center">
                <h2>Cart Summary</h2>
                <p>Total | Checkout | Payment</p>
                <hr />
                <h4>Total : {totalPrice()} </h4>
                {auth?.user?.address ? ( // if user has address then show address and then update button
                <>
                    <div className="mb-3">
                      <h4>Current Address</h4>
                      <h5>{auth?.user?.address}</h5>
                      <button
                          className="btn btn-outline-warning"
                          onClick={() => navigate("/dashboard/user/profile")}
                      >
                          Update Address
                      </button>
                    </div>
                </>
                ) : (
                <div className="mb-3">
                    {auth?.token ? ( //If logged in then show update address button
                    <button
                        className="btn btn-outline-warning"
                        onClick={() => navigate("/dashboard/user/profile")}
                    >
                        Update Address
                    </button>
                    ) : ( // If not logged in then show login button
                    <button
                        className="btn btn-outline-warning"
                        onClick={() =>
                        navigate("/login", {
                            state: "/cart",
                        })
                        }
                    >
                        Plase Login to checkout
                    </button>
                    )}
                </div>
                )}
                {/* Make payment option */}
                <div className="mt-2">
                  {!clientToken || !cart?.length ? ( "" ) : ( // if client token and cart is available then show checkout button
                    <>
                      <DropIn //BrainTree's UI component for rendering payment methods like cards and PayPal
                        options={{
                          authorization: clientToken, //Uses the clientToken from the backend to authenticate the payment
                          paypal: {
                            flow: "vault", //Enables PayPal vault payment (storing payment info to avoid re-entering them in future)
                          },
                        }}
                        //Sets the BrainTree instance for later use when the payment is processed
                        onInstance={(instance) => setInstance(instance)}
                      />
                      <button
                        className="btn btn-primary"
                        onClick={handlePayment}
                        disabled={loading || !instance || !auth?.user?.address}
                      >
                        {loading ? "Processing ...." : "Make Payment"}
                      </button>
                    </>
                  )}
                </div>
            </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;