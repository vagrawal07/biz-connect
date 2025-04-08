import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getMessages,
  sendMessage,
  fetchUsers,
  fetchBusinesses,
} from "../../services/messageService";

const MessagingPage = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [receiverModel, setReceiverModel] = useState("User");
  const [users, setUsers] = useState([]);
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getMessages(token);
        setMessages(data);
        const u = await fetchUsers(token);
        const b = await fetchBusinesses(token);
        setUsers(u);
        setBusinesses(b);
      } catch (err) {
        console.error("Failed to fetch messages or receivers", err);
      }
    };
    fetch();
  }, [token]);

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      const message = {
        receiver: receiverId,
        receiverModel,
        content,
      };
      await sendMessage(message, token);
      setContent("");
      const updated = await getMessages(token);
      setMessages(updated);
    } catch (err) {
      alert("Message send failed");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📬 Messages</h2>

      <form onSubmit={handleSend} className="space-y-4 bg-white shadow p-4 rounded-lg mb-6">
        <select
          value={receiverModel}
          onChange={(e) => {
            setReceiverModel(e.target.value);
            setReceiverId("");
          }}
          className="w-full px-4 py-2 border rounded text-black"
        >
          <option value="User">Message a User</option>
          <option value="Business">Message a Business</option>
        </select>

        <select
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
          className="w-full px-4 py-2 border rounded text-black"
          required
        >
          <option value="">Select Receiver</option>
          {(receiverModel === "User" ? users : businesses).map((r) => (
            <option key={r._id} value={r._id}>
              {r.name}
            </option>
          ))}
        </select>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type your message..."
          className="w-full px-4 py-2 border rounded text-black"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Send
        </button>
      </form>

      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg._id} className="bg-white p-3 shadow rounded">
            <p className="text-sm text-gray-800">
              <strong>{msg.sender?.name}</strong> → <strong>{msg.receiver?.name}</strong>
            </p>
            <p className="text-gray-700">{msg.content}</p>
            <p className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessagingPage;