import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import NewConversationModal from "./NewConversationModal";
import Navbar from "../dashboard/business/Navbar";
import UserNavbar from "../dashboard/user/Navbar";

const MessagingInbox = () => {
  const { token, user } = useSelector((state) => state.auth);
  const [threads, setThreads] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [content, setContent] = useState("");

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const fetchThreads = async () => {
      const res = await axios.get("/api/messages/threads", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setThreads(res.data);

      if (!params.id && res.data.length > 0) {
        const first = res.data[0];
        setActiveThread(first);
        navigate(`/messages/inbox/${first.participantModel.toLowerCase()}/${first.participantId}`);
      }
    };
    fetchThreads();
  }, [token]);

  useEffect(() => {
    if (params.id && params.model) {
      const selected = threads.find(
        (t) => t.participantId === params.id && t.participantModel.toLowerCase() === params.model
      );
      if (selected) setActiveThread(selected);

      const fetchMessages = async () => {
        const res = await axios.get(`/api/messages/thread/${params.model}/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      };
      fetchMessages();
    }
  }, [params, threads, token]);

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "/api/messages",
        {
          receiver: activeThread.participantId,
          receiverModel: activeThread.participantModel,
          content,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContent("");
      const res = await axios.get(`/api/messages/thread/${params.model}/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch (err) {
      alert("Send failed");
    }
  };

  return (
    <div className="min-h-screen min-w-screen bg-[#f1f5f9]">
      {user?.role === "business" ? <Navbar /> : <UserNavbar />}

      <div className="flex h-[calc(90vh)] max-w-7xl mx-auto mt-4 rounded-lg border bg-white overflow-hidden shadow">
        {/* Sidebar */}
        <aside className="w-1/3 border-r bg-white p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">📥 Inbox</h2>
            <button
              onClick={() => setShowNewModal(true)}
              className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              + New
            </button>
          </div>

          {showNewModal && <NewConversationModal onClose={() => setShowNewModal(false)} />}

          <div className="space-y-2">
            {threads.map((t) => (
              <div
                key={t._id}
                onClick={() =>
                  navigate(`/messages/inbox/${t.participantModel.toLowerCase()}/${t.participantId}`)
                }
                className={`cursor-pointer p-3 rounded-lg transition-all ${
                  params.id === t.participantId
                    ? "bg-blue-50 border border-blue-500 text-blue-800 shadow-sm"
                    : "hover:bg-gray-100 text-gray-800"
                }`}
              >
                <h3 className="font-semibold truncate">{t.participantName}</h3>
                <p className="text-xs text-gray-600 truncate">{t.lastMessage}</p>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col p-6">
          {activeThread ? (
            <>
              <div className="border-b pb-4 mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  💬 Chat with {activeThread.participantName}
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 px-2">
                {messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`max-w-[75%] p-3 rounded-lg text-sm shadow-sm ${
                      msg.sender._id === user._id
                        ? "ml-auto bg-blue-100 text-right text-gray-900"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSend} className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p className="text-lg">💌 Start chatting by selecting a conversation</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MessagingInbox;
