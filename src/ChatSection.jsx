import React, { useState, useEffect } from "react";
import axios from "axios";

const backend_url = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export default function ChatSection({ questionId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (questionId) {
      axios
        .get(`/api/chat/${questionId}`)
        .then((res) => {
          const data = Array.isArray(res.data) ? res.data : [];
          setMessages(data);
        })
        .catch((err) => {
          console.error("Error fetching messages", err);
          setMessages([]);
        });
    }
  }, [questionId]);

  const handleSend = async () => {
    if (!input.trim()) return;
    try {
      const res = await axios.post(`/api/chat`, {
        questionId,
        text: input,
      });
      setMessages([res.data, ...messages]);
      setInput("");
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  const handleLike = async (id) => {
    try {
      const res = await axios.post(`/api/chat/like`, { messageId: id });
      setMessages((prev) => prev.map((m) => (m.id === id ? res.data : m)));
    } catch (err) {
      console.error("Error liking message", err);
    }
  };

  const handleReply = async (id, replyText) => {
    try {
      const res = await axios.post(`/api/chat/reply`, {
        messageId: id,
        replyText,
      });
      setMessages((prev) => prev.map((m) => (m.id === id ? res.data : m)));
    } catch (err) {
      console.error("Error sending reply", err);
    }
  };

  return (
    <div className="flex justify-center mt-8 px-4">
      <div className="w-full max-w-2xl rounded-3xl shadow-2xl p-6 border border-[#444] bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white font-mono">
        <h2 className="text-2xl font-bold mb-6 text-center text-yellow-400 tracking-wide select-none">
          💬 Game Chat Lounge
        </h2>

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Type your strategy..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            className="flex-1 bg-[#3b2b4d] border border-[#75528e] px-4 py-3 rounded-xl text-white placeholder-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />
          <button
            onClick={handleSend}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-7 py-3 rounded-xl font-bold shadow-lg transition"
          >
            Send
          </button>
        </div>

        <div
          className="space-y-5 max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-transparent rounded-xl px-2"
          style={{ overscrollBehavior: "contain" }}
        >
          {messages.length === 0 && (
            <p className="text-center text-yellow-300/70 select-none">
              No messages yet. Be the first to drop a 🔥 comment!
            </p>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className="bg-[#4b367a] rounded-xl p-5 shadow-md border border-[#6c4f9b] select-text"
            >
              <div className="flex justify-between items-center mb-3">
                <p className="text-lg break-words">{m.text}</p>
                <button
                  onClick={() => handleLike(m.id)}
                  className="text-pink-400 hover:text-pink-600 transition text-xl select-none"
                  aria-label="Like message"
                  title="Like this message ❤️"
                >
                  ❤️ {m.likes}
                </button>
              </div>

              <div className="ml-6 space-y-3">
                {m.replies?.map((r, idx) => (
                  <div
                    key={r.id || idx}
                    className="ml-6 text-sm text-yellow-300 border-l-2 border-yellow-400 pl-3 break-words"
                  >
                    ↳ {r.text}
                  </div>
                ))}

                <ReplyInput onReply={(text) => handleReply(m.id, text)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReplyInput({ onReply }) {
  const [reply, setReply] = useState("");

  const submitReply = () => {
    if (reply.trim()) {
      onReply(reply);
      setReply("");
    }
  };

  return (
    <div className="flex gap-3 mt-3">
      <input
        type="text"
        value={reply}
        placeholder="Reply..."
        onChange={(e) => setReply(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submitReply();
        }}
        className="flex-1 bg-[#6a5080] border border-[#8c6fc1] px-3 py-2 text-sm text-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
      />
      <button
        onClick={submitReply}
        className="text-sm text-yellow-400 hover:text-yellow-600 font-semibold transition select-none"
      >
        Reply
      </button>
    </div>
  );
}
