import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getBusinessById, updateBusinessById } from "../../../services/businessService";
import Navbar from "./Navbar";

const BusinessProfileEditor = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    name: "",
    incorporationType: "",
    description: "",
    contactDetails: "",
    industry: "",
    location: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getBusinessById(user._id, token);
        setForm(res.data);
      } catch (err) {
        console.error("Failed to fetch business profile", err);
      }
    };

    if (user?._id) fetchProfile();
  }, [user, token]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateBusinessById(user._id, form, token);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] min-w-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto py-10 px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">📝 Edit Business Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-xl shadow">
          {Object.entries({
            name: "Business Name",
            incorporationType: "Incorporation Type",
            description: "Description",
            contactDetails: "Contact Details",
            industry: "Industry",
            location: "Location",
          }).map(([field, label]) => (
            <div key={field}>
              <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>
              <input
                name={field}
                value={form[field] || ""}
                onChange={handleChange}
                placeholder={label}
                className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition duration-200"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default BusinessProfileEditor;