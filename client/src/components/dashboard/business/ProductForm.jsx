import React, { useState } from "react";
import axios from "../../../utils/axios";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";

const BusinessProductForm = ({ onProductAdded }) => {
  const { user, token } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    availability: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        businessId: user._id,
      };
      const res = await axios.post("/api/products", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ name: "", description: "", price: "", availability: true });
      onProductAdded(res.data);
    } catch (err) {
      console.error("Error creating product", err);
      alert("Failed to add product.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-gray-700">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Product or Service</h2>

      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Price</label>
        <input
          name="price"
          type="number"
          step="0.01"
          value={form.price}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          name="availability"
          type="checkbox"
          checked={form.availability}
          onChange={handleChange}
          className="accent-blue-600"
        />
        <label className="text-sm">Available</label>
      </div>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition"
      >
        Add Product
      </button>
    </form>
  );
};

export default BusinessProductForm;
