import React from "react";
import { useState } from "react";
import { IoArrowBack } from "react-icons/io5";

const Shipping = () => {
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  return (
    <div className="shipping">
      <button className="back-btn" onClick={() => window.history.back()}>
        {" "}
        <IoArrowBack />
      </button>
      <form>
        <h1>SHIPPING INFO</h1>

        <input
          name="address"
          type="text"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
        ></input>

        <input
          name="city"
          type="text"
          value={formData.city}
          placeholder="City"
          onChange={handleChange}
        ></input>

        <input
          name="state"
          type="text"
          value={formData.state}
          placeholder="State"
          onChange={handleChange}
        ></input>

        {/* <label>
          Country
          <input
            name="country"
            type="text"
            value={formData.country}
            onChange={handleChange}
          ></input>
        </label> */}

        <select
          name="country"
          value={formData.country}
          required
          onChange={handleChange}
        >
          <option value="">Select Country</option>
          <option value="India">India</option>
          <option value="USA">USA</option>
          <option value="UK">UK</option>
          <option value="Canada">Canada</option>
        </select>

        <input
          name="pincode"
          placeholder="Pincode"
          type="number"
          value={formData.pincode}
          onChange={handleChange}
        ></input>

        <button onSubmit={handleSubmit} type="submit">
          Pay
        </button>
      </form>
    </div>
  );
};

export default Shipping;
