import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../features/auth/authSlice";
import { Menu, X } from "lucide-react";

const UserNavbar = () => {
  const { user, role, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/signin");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-xl font-bold text-blue-600">BizConnect</div>
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div
          className={`${
            isOpen ? "block" : "hidden"
          } md:flex items-center gap-4 mt-4 md:mt-0 md:space-x-6 w-full md:w-auto text-sm text-gray-700`}
        >
          {token ? (
            <>
              <span className="block md:inline text-sm text-gray-700 font-medium">Hi, {user?.name}</span>
              <Link to="/business/top" className="block hover:text-blue-600">🏆 Top Businesses</Link>

              <Link to="/messages/inbox" className="block hover:text-blue-600">Inbox</Link>
              <Link
                to={role === "business" ? "/dashboard/business" : "/dashboard/user"}
                className="block hover:text-blue-600"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="block bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="block hover:text-blue-600">Sign In</Link>
              <Link to="/signup" className="block hover:text-blue-600">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;