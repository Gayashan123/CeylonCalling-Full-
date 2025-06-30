import { useState } from "react";
import { motion } from "framer-motion";
import { FiSend } from "react-icons/fi";
import { FaRegCommentDots } from "react-icons/fa";

export function CommentList({ comments }) {
  if (!comments?.length)
    return (
      <div className="text-gray-400 text-sm italic px-2 pb-2">
        No comments yet.
      </div>
    );
  return (
    <div className="space-y-2 mt-2">
      {comments.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.23, delay: i * 0.04 }}
          className="flex items-start gap-2"
        >
          <div className="bg-gradient-to-tr from-blue-200 via-cyan-100 to-pink-100 rounded-full p-2">
            <FaRegCommentDots className="text-blue-400" />
          </div>
          <div className="bg-white rounded-lg px-3 py-2 shadow text-gray-700 max-w-xl">
            <div className="text-xs text-gray-400 mb-1">{c.user || "Anonymous"}</div>
            <div className="text-sm">{c.text}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function AddComment({ onAdd }) {
  const [text, setText] = useState("");
  const [user, setUser] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 700));
    onAdd({ text, user: user || "Anonymous" });
    setText("");
    setSending(false);
  };

  return (
    <form className="flex flex-col sm:flex-row items-center gap-2 mt-4" onSubmit={handleSubmit}>
      <input
        className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-gray-800 shadow focus:outline-none focus:ring-2 focus:ring-blue-300"
        placeholder="Your name (optional)"
        value={user}
        onChange={e => setUser(e.target.value)}
        disabled={sending}
        maxLength={18}
      />
      <input
        className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-gray-800 shadow focus:outline-none focus:ring-2 focus:ring-blue-300"
        placeholder="Add a comment..."
        value={text}
        onChange={e => setText(e.target.value)}
        disabled={sending}
        maxLength={120}
        required
      />
      <button
        type="submit"
        className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full shadow transition font-semibold disabled:opacity-60"
        disabled={sending || !text.trim()}
      >
        <FiSend className="text-lg" />
        {sending ? "Adding..." : "Add"}
      </button>
    </form>
  );
}