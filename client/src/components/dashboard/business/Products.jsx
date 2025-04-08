import React, { useEffect, useState } from "react";
import axios from "../../../utils/axios";
import { useSelector } from "react-redux";
import BusinessProductForm from "./ProductForm";
import Navbar from "./Navbar";

const BusinessProductManager = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showModal, setShowModal] = useState(false);

  const handleProductAdded = (newProduct) => {
    setProducts((prev) => [...prev, newProduct]);
    setShowModal(false);
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`/api/products/business/${user._id}`);
      if (Array.isArray(res.data)) {
        setProducts(res.data);
      } else {
        console.error("Expected an array but got:", res.data);
        setProducts([]);
      }
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  const startEditing = (product) => {
    setEditingId(product._id);
    setEditForm({ ...product });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm({ ...editForm, [name]: type === "checkbox" ? checked : value });
  };

  const saveEdit = async () => {
    try {
      const res = await axios.put(`/api/products/${editingId}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.map((p) => (p._id === editingId ? res.data : p)));
      cancelEditing();
    } catch (err) {
      alert("Failed to save changes");
    }
  };

  useEffect(() => {
    if (user) fetchProducts();
  }, [user]);

  if (loading) return <p className="p-6 text-gray-600">Loading products...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen min-w-screen bg-[#f8fafc] text-gray-800">
      <Navbar />
      <div className="max-w-4xl mx-auto py-10 px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="text-3xl font-bold">🛍️ Your Products & Services</div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            + Add Product
          </button>
        </div>

        {products.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          <div className="space-y-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white border border-gray-200 rounded-lg p-5 shadow hover:shadow-md transition"
              >
                {editingId === product._id ? (
                  <div className="space-y-4 text-gray-700">
                    <input
                      name="name"
                      value={editForm.name}
                      onChange={handleEditChange}
                      placeholder="Product Name"
                      className="w-full px-4 py-2 border rounded text-sm"
                    />
                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleEditChange}
                      placeholder="Description"
                      className="w-full px-4 py-2 border rounded text-sm"
                    />
                    <input
                      name="price"
                      type="number"
                      value={editForm.price}
                      onChange={handleEditChange}
                      placeholder="Price"
                      className="w-full px-4 py-2 border rounded text-sm"
                    />
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        name="availability"
                        checked={editForm.availability}
                        onChange={handleEditChange}
                      />
                      Available
                    </label>
                    <div className="space-x-3">
                      <button
                        onClick={saveEdit}
                        className="bg-green-600 text-white px-4 py-1.5 rounded hover:bg-green-700 text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded hover:bg-gray-300 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-700">
                    <h2 className="text-lg font-semibold text-blue-700">{product.name}</h2>
                    <p className="text-sm mt-1 mb-2">{product.description}</p>
                    <p className="text-sm">💰 Price: ${product.price}</p>
                    <p className="text-sm">
                      📦 Availability: {product.availability ? "Available" : "Out of stock"}
                    </p>
                    <div className="mt-4 space-x-4">
                      <button
                        className="text-sm text-blue-600 hover:underline"
                        onClick={() => startEditing(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-sm text-red-600 hover:underline"
                        onClick={() => deleteProduct(product._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-xs flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl relative shadow-xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Add New Product</h2>
            <BusinessProductForm onProductAdded={handleProductAdded} />
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessProductManager;