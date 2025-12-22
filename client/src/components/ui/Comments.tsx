import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  X,
  Check,
  Reply,
  Send,
  MoreHorizontal,
} from "lucide-react";

const CommentSidebar = ({
  addComment,
  yComments,
  getSelectedCommentId,
}: any) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState<any[]>([]);

  // 1. Listen to Yjs Map changes to sync the UI
  useEffect(() => {
    const syncComments = () => {
      // Convert Y.Map values to an array and sort by date
      const items = Array.from(yComments.values()).sort(
        (a: any, b: any) => b.createdAt - a.createdAt
      );
      setCommentsList(items);
    };

    // Observe changes from local or remote users
    yComments.observe(syncComments);
    syncComments(); // Initial load

    return () => yComments.unobserve(syncComments);
  }, [yComments]);

  const handleSend = () => {
    if (!commentText.trim()) return;
    addComment(commentText);
    setCommentText(""); // Clear input after sending
  };

  return (
    <>
      {/* TRIGGER ICON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative p-2.5 rounded-xl transition-all duration-200 hover:bg-gray-100 active:scale-95"
      >
        <MessageSquare
          size={20}
          className={isOpen ? "text-blue-600" : "text-gray-600"}
        />
        {commentsList.length > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></span>
        )}
      </button>

      {/* SLIDE-OVER PANEL */}
      <div
        className={`fixed top-14 right-4 h-[calc(100vh-80px)] bg-white/90 backdrop-blur-xl border border-gray-200 shadow-2xl z-[999] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] rounded-2xl overflow-hidden flex flex-col
          ${
            isOpen
              ? "w-[360px] translate-x-0 opacity-100"
              : "w-[360px] translate-x-10 opacity-0 pointer-events-none"
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white/50">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Activity</h2>
            <p className="text-[11px] text-gray-500">
              {commentsList.length} comments
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"
          >
            <X size={18} />
          </button>
        </div>

        {/* Dynamic Comment List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {commentsList.map((c) => (
            <div
              onClick={() => getSelectedCommentId(c.id)}
              key={c.id}
              className="group relative animate-in fade-in slide-in-from-right-4 duration-300"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-[10px] text-white font-bold uppercase">
                  {c.authorName?.substring(0, 2) || "U"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      {c.authorName || "Anonymous"}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium tracking-wider">
                      {new Date(c.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="mt-1 text-[13px] text-gray-600 leading-relaxed bg-gray-50 rounded-tr-xl rounded-b-xl p-3 border border-gray-100">
                    {c.text}
                  </div>
                  <div className="mt-2 flex items-center gap-4 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 hover:text-blue-600 transition-colors uppercase tracking-tight">
                      <Reply size={12} /> Reply
                    </button>
                    <button className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 hover:text-green-600 transition-colors uppercase tracking-tight">
                      <Check size={12} /> Resolve
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {commentsList.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <MessageSquare size={40} className="mb-2 opacity-20" />
              <p className="text-sm">No comments yet</p>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Write a comment..."
              className="w-full bg-transparent text-sm text-gray-700 focus:outline-none pr-8"
            />
            <button
              onClick={handleSend}
              className="absolute right-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm active:scale-95 disabled:opacity-50"
              disabled={!commentText.trim()}
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentSidebar;
