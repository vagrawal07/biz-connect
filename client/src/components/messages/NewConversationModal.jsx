import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const NewConversationModal = ({ onClose }) => {
  const { token } = useSelector((state) => state.auth);
  const [recipients, setRecipients] = useState([]);
  const [receiverId, setReceiverId] = useState("");
  const [receiverModel, setReceiverModel] = useState("User");
  const [content, setContent] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(
          receiverModel === "User" ? "/api/users" : "/api/business",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRecipients(res.data);
      } catch (err) {
        console.error("Failed to load recipients", err);
      }
    };
    fetch();
  }, [receiverModel, token]);

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "/api/messages",
        { receiver: receiverId, receiverModel, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onClose?.(); // Close modal
      navigate(`/messages/inbox/${receiverModel.toLowerCase()}/${receiverId}`);
    } catch (err) {
      alert("Failed to start conversation");
    }
  };

  return (
    <div className="fixed inset-0  bg-white/30 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Start New Conversation</h2>

        <form onSubmit={handleSend} className="space-y-4">
          <select
            value={receiverModel}
            onChange={(e) => setReceiverModel(e.target.value)}
            className="w-full px-3 py-2 border rounded text-black"
          >
            <option value="User">User</option>
            <option value="Business">Business</option>
          </select>

          <select
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded text-black"
          >
            <option value="">Select recipient...</option>
            {recipients.map((r) => (
              <option key={r._id} value={r._id}>
                {r.name}
              </option>
            ))}
          </select>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your message..."
            className="w-full px-3 py-2 border rounded text-black"
            required
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-black px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewConversationModal;
