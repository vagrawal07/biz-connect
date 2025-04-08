import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setAuth, setAuthError } from "../../features/auth/authSlice";
import { register } from "../../services/authService";
import { Link } from "react-router-dom";
import { Briefcase, User } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

const Signup = () => {
  const dispatch = useDispatch();
  const [isBusiness, setIsBusiness] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    incorporationType: "",
    role: "user",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleRole = () => {
    const newRole = !isBusiness ? "business" : "user";
    setIsBusiness(!isBusiness);
    setForm({ ...form, role: newRole });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register(form);
      dispatch(setAuth({ user: res.user, token: res.token, role: form.role }));
    } catch (err) {
      console.error(err);
      dispatch(setAuthError("Signup failed. Email might already exist."));
    }
  };

  return (
    <div className="flex h-screen w-screen">
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
              onClick={toggleRole}
              className="flex items-center p-2 rounded  bg-black gap-2 text-md text-white hover:underline"
            >
              {isBusiness ? <User size={16} /> : <Briefcase size={16} />} 
              Switch to {isBusiness ? "User" : "Business"} Signup
            </button>
          </div>

          <h2 className="text-3xl font-bold mb-4 text-gray-900">{isBusiness ? "Business" : "User"} Sign Up</h2>
          <p className="text-sm text-gray-600 mb-6">Fill out the information below to register.</p>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">Name <span className="text-red-500">*</span></label>
            <input
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email here"
              className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
            <input
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="Enter a password"
              className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <AnimatePresence>
            {isBusiness && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 overflow-hidden"
              >
                <label className="block mb-2 text-sm font-medium text-gray-700">Incorporation Type <span className="text-red-500">*</span></label>
                <input
                  name="incorporationType"
                  required
                  value={form.incorporationType}
                  onChange={handleChange}
                  placeholder="e.g., LLC, Corp, Sole Proprietor"
                  className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
          >
            Register
          </button>

          <p className="text-sm text-center text-gray-600 mt-4">
            Already have an account? <Link to="/signin" className="text-blue-600 hover:underline">Sign In</Link>
          </p>
        </form>
      </div>

      <div className="hidden md:flex md:w-1/2 h-full bg-[#1A1A40] items-center justify-center text-white">
        <div className="text-center">
          <div className="text-4xl font-semibold flex items-center justify-center gap-2">
            BizConnect
          </div>
          <p className="text-sm mt-4 text-white opacity-90">
            Connecting People to Businesses that Matter
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;