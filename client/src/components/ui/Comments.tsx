import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  X,
  Check,
  Reply,
  Send,
  Undo2,
} from "lucide-react";

const CommentSidebar = ({
  addComment,
  yComments,
  getSelectedCommentId,
  resolveComment,
  unresolveComment,
}: any) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "open" | "resolved">("all");

  useEffect(() => {
    const syncComments = () => {
      const items = Array.from(yComments.values()).sort(
        (a: any, b: any) => b.createdAt - a.createdAt
      );
      setCommentsList(items);
    };

    yComments.observe(syncComments);
    syncComments();

    return () => yComments.unobserve(syncComments);
  }, [yComments]);

  const handleSend = () => {
    if (!commentText.trim()) return;
    addComment(commentText);
    setCommentText("");
  };

  const filteredComments = commentsList.filter((c) => {
    if (activeTab === "all") return true;
    return activeTab === "open" ? !c.resolved : c.resolved;
  });

  return (
    <>
      {/* TRIGGER ICON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg transition-colors hover:bg-gray-100"
      >
        <MessageSquare
          size={20}
          className={isOpen ? "text-gray-900" : "text-gray-600"}
          strokeWidth={1.5}
        />
        {commentsList.filter((c) => !c.resolved).length > 0 && (
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
        )}
      </button>

      {/* SLIDE-OVER PANEL */}
      <div
        className={`fixed top-14 right-0 h-[calc(100vh-58px)] w-80 bg-white border-l border-gray-200 shadow-xl z-70 transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-medium text-gray-900">Comments</h2>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-500 hover:text-gray-900"
            >
              <X size={18} strokeWidth={2} />
            </button>
          </div>

          {/* TABS */}
          <div className="flex gap-6 border-b border-gray-200 -mb-4">
            {["all", "open", "resolved"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-3 text-sm font-medium transition-colors relative capitalize ${
                  activeTab === tab ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Comment List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {filteredComments.map((c) => (
            <div
              onClick={() => getSelectedCommentId(c.id)}
              key={c.id}
              className={`group p-4 rounded-lg border transition-all cursor-pointer ${
                c.resolved 
                  ? "bg-gray-50 border-gray-200" 
                  : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
                  c.resolved ? "bg-gray-300 text-gray-600" : "bg-gray-900 text-white"
                }`}>
                  {c.authorName?.substring(0, 1).toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {c.authorName || "Anonymous"}
                    </span>
                    <span className="text-xs text-gray-400 shrink-0">
                      {new Date(c.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed ${
                    c.resolved ? "text-gray-500" : "text-gray-700"
                  }`}>
                    {c.text}
                  </p>

                  {/* ACTION BUTTONS */}
                  <div className="mt-3 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!c.resolved ? (
                      <>
                        <button className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 transition-colors">
                          <Reply size={14} strokeWidth={2} />
                          Reply
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            resolveComment(c.id);
                          }}
                          className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-green-600 transition-colors"
                        >
                          <Check size={14} strokeWidth={2} />
                          Resolve
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          unresolveComment && unresolveComment(c.id);
                        }}
                        className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <Undo2 size={14} strokeWidth={2} />
                        Reopen
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredComments.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <MessageSquare size={48} className="mb-3 text-gray-300" strokeWidth={1.5} />
              <p className="text-sm text-gray-500">No {activeTab} comments</p>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="px-6 py-4 border-t border-gray-100">
          <div className="relative flex items-center gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Add a comment..."
              className="flex-1 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow"
            />
            <button
              onClick={handleSend}
              className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={!commentText.trim()}
            >
              <Send size={16} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentSidebar;