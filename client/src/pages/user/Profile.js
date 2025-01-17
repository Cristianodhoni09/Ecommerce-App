import React from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";

const Profile = () => {
  return (
    <Layout title={"Dashboard - Profile"}>
      <div className="container-fluid p-3 m-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <h1>Profile</h1>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;


/*
// Example: Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Format the date before sending to the client
    const formattedUser = {
      ...user.toObject(),
      question: user.question.toISOString().split('T')[0].split('-').reverse().join('/') // Format as dd/MM/yyyy
    };

    res.status(200).json({ success: true, user: formattedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error retrieving user data", error });
  }
};

*/