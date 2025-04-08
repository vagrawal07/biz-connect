import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../../utils/axios";
import { useSelector } from "react-redux";

import FinancialCharts from "./FinancialChart";
import Navbar from "./Navbar";
import UserNavbar from "../user/Navbar";

const BusinessProfilePage = () => {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await axios.get(`/api/business/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBusiness(res.data);
      } catch (err) {
        console.error("Failed to fetch business details", err);
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await axios.get(`/api/products/business/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };

    fetchBusiness();
    fetchProducts();
  }, [id, token]);

  if (!business) return <div className="p-6">Loading business details...</div>;

  return (
    <div className="min-h-screen min-w-screen bg-[#f8fafc] text-gray-800">
      {user?.role === "business" ? <Navbar /> : <UserNavbar />}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">{business.name}</h1>
          <p className="text-gray-700 text-sm mb-1"><strong>Type:</strong> {business.incorporationType}</p>
          <p className="text-gray-700 text-sm mb-1"><strong>Industry:</strong> {business.industry}</p>
          <p className="text-gray-700 text-sm mb-1"><strong>Location:</strong> {business.location}</p>
          <p className="text-gray-700 text-sm mb-4"><strong>Contact:</strong> {business.contactDetails}</p>
          <p className="text-gray-600 leading-relaxed">{business.description}</p>
        </div>

        {products.length > 0 && (
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">🛍️ Products & Services</h2>
            <ul className="space-y-4">
              {products.map((product) => (
                <li
                  key={product._id}
                  className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <h3 className="font-medium text-gray-900 text-lg">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{product.description}</p>
                  <p className="text-sm text-gray-700">💲 {product.price} | {product.availability ? "Available" : "Out of Stock"}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {user?.role === "business" && (
          <div className="bg-white rounded-xl">
            <FinancialCharts />
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessProfilePage;
