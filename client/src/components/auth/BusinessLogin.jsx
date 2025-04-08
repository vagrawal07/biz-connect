import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuth, setAuthError } from "../../features/auth/authSlice";
import { login } from "../../services/authService";
import { Link } from "react-router-dom";

const BusinessLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      const role = res.user.role; // get role from user

      dispatch(setAuth({ user: res.user, token: res.token, role }));

      // Redirect based on role
      if (role === "business") {
        navigate("/dashboard/business");
      } else {
        navigate("/dashboard/user");
      }
    } catch (err) {
      console.log(err);
      dispatch(setAuthError("Login failed. Invalid credentials."));
    }
  };

  return (
    <div className="flex h-screen w-screen">
      {/* Left Form Section */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Sign In</h2>
          <p className="text-sm text-gray-600 mb-6">Enter your email and password to sign in!</p>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email here"
              className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* <div className="flex items-center justify-end mb-6">
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div> */}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
          >
            Sign in
          </button>

          <p className="text-sm text-center text-gray-600 mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>

      {/* Right Branding Section */}
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

export default BusinessLogin;
