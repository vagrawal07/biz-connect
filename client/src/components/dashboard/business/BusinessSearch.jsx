import React, { useEffect, useState } from "react";
import axios from "../../../utils/axios";
import { useSelector } from "react-redux";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import Navbar from "./Navbar";
import UserNavbar from "../user/Navbar";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BusinessSearch = () => {
  const [businesses, setBusinesses] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [metric, setMetric] = useState("totalRevenue");
  const [threshold, setThreshold] = useState(5);
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const res = await axios.get("/api/financials/top", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBusinesses(res.data);
        setSearchResults(res.data);
      } catch (err) {
        console.error("Failed to fetch business data", err);
      }
    };
    fetchBusinesses();
  }, [token]);

  const handleSearch = () => {
    if (!metric || !threshold || isNaN(threshold)) {
      return setSearchResults(businesses);
    }

    const sorted = [...businesses]
      .filter((b) => !isNaN(parseFloat(b[metric])))
      .sort((a, b) => parseFloat(b[metric]) - parseFloat(a[metric]))
      .slice(0, threshold);

    setSearchResults(sorted);
  };

  const chartData = {
    labels: searchResults.map((b, i) => `#${i + 1} - ${b.name}`),
    datasets: [
      {
        label: metric,
        data: searchResults.map((b) => parseFloat(b[metric])),
        backgroundColor: "#3b82f6",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: `Top ${threshold} Businesses by ${metric}` },
    },
  };

  return (
    <div className="min-h-screen min-w-screen bg-[#f8fafc] text-gray-800">
      {user?.role === "business" ? <Navbar /> : <UserNavbar />}

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="text-3xl font-bold mb-6">📊 Search Top Businesses by Metrics</div>

        <div className="flex flex-wrap gap-4 mb-8">
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-black focus:ring-2 focus:ring-blue-500"
          >
            <option value="totalRevenue">Total Revenue</option>
            <option value="CAGR">CAGR</option>
            <option value="profitMargin">Profit Margin</option>
            <option value="ROI">ROI</option>
            <option value="customerRetentionRate">Customer Retention Rate</option>
          </select>

          <input
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(parseInt(e.target.value))}
            placeholder="Top N (e.g. 5)"
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium"
          >
            Search
          </button>
        </div>

        {user?.role !== "user" && searchResults.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow mb-10">
            <Bar data={chartData} options={chartOptions} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {searchResults.map((b, index) => (
            <div
              key={b.businessId}
              className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
            >
              <h2
                className={`text-lg font-semibold flex items-center gap-2 mb-2 ${
                  index === 0
                    ? "text-yellow-500"
                    : index === 1
                    ? "text-gray-400"
                    : index === 2
                    ? "text-orange-400"
                    : "text-blue-600"
                }`}
              >
                {index === 0 && "🥇"}
                {index === 1 && "🥈"}
                {index === 2 && "🥉"}
                #{index + 1} - {b.name}
              </h2>
              <p className="text-sm text-gray-700">Industry: {b.industry}</p>
              <p className="text-sm text-gray-700">Location: {b.location}</p>
              {user?.role !== "user" && (
                <>
                  <p className="text-sm mt-2 text-gray-800 font-medium">Total Revenue: ${b.totalRevenue}</p>
                  <p className="text-sm text-gray-800">CAGR: {b.CAGR}%</p>
                  <p className="text-sm text-gray-800">Profit Margin: {b.profitMargin}%</p>
                  <p className="text-sm text-gray-800">ROI: {b.ROI}%</p>
                  <p className="text-sm text-gray-800">Customer Retention: {b.customerRetentionRate}%</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusinessSearch;