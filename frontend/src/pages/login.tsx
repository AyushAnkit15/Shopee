import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import toast from "react-hot-toast";
// import { IoLogoGoogle } from "react-icons/io5";
import { FaGoogle } from "react-icons/fa";
import { auth } from "../firebase";

import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { MessageResponse } from "../types/api.types";
import { useLoginMutation } from "../redux/api/userAPI";

const login = () => {
  const [formData, setFormData] = useState({
    gender: "Male",
    dateOfBirth: "",
  });

  const [login] = useLoginMutation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const loginHandler = async () => {
    try {
      const provider = new GoogleAuthProvider();

      const { user } = await signInWithPopup(auth, provider);
      console.log(formData.dateOfBirth  , formData.gender)
      if(formData.gender===""){
        console.log("pakad lita")
      }

      const res = await login({
        DOB:  formData.dateOfBirth,
        name: user.displayName!,
        email: user.email!,
        role: "user",
        photo: "https://randomuser.me/api/portraits/women/54.jpg",
        gender: formData.gender,
        
        _id  :user.uid,
      });

      if ("data" in res) {
        toast.success(res.data.message);
      } else {
        const error = res.error as FetchBaseQueryError;
        const message = (error.data as MessageResponse).message;

        toast.error(message);
      }

      console.log(user);
    } catch (error) {
      toast.error("Not able to sign in  , try again");
    }
  };

  return (
    <div className="login">
      <main>
        <h1 className="heading">LOGIN</h1>

        <div>
          <label>Gender</label>
          <select value={formData.gender} name="gender" onChange={handleChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <label>Date Of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
          ></input>
        </div>

        <div>
          <h1>NOT HERE FOR FIRST TIME</h1>
          <button onClick={loginHandler}>
            <FaGoogle />
            <span>SIGN IN WITH GOOGLE</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default login;
