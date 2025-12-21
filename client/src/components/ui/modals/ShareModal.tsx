import React, { useState } from "react";
import { X, UserPlus, Link } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  docId: string;
  handleAddColaborator: (email: string, docId: string) => void;
}

export const ShareModal = ({
  isOpen,
  onClose,
  docId,
  handleAddColaborator,
}: ShareModalProps) => {
  const [email, setEmail] = useState("");

  if (!isOpen) return null;

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Sharing document ${docId} with: ${email}`);
    handleAddColaborator(email, docId);
    setEmail("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4">
          <h2 className="text-xl font-normal text-gray-800">
            Share "Untitled document"
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleShare} className="px-6 pb-6">
          <div className="relative flex items-center mb-6">
            <div className="absolute left-3 text-gray-400">
              <UserPlus size={18} />
            </div>
            <input
              type="email"
              placeholder="Add people, groups, and calendar events"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Role Selection (Fake for UI) */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm text-gray-600 font-medium">General access</p>
            <div className="flex items-center gap-2 text-blue-600 cursor-pointer hover:underline text-sm font-medium">
              <Link size={14} />
              Copy link
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-colors"
            >
              Done
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
