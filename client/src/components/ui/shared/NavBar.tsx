import  { useState, useRef, useEffect } from "react";
import {
  Search,
  FileText,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../../context/authContext";

const NavBar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        
        {/* LEFT: Logo */}
        <div className="flex items-center">
          <div className="flex items-center gap-2 cursor-pointer">
            <FileText size={24} className="text-gray-900" strokeWidth={2} />
            <span className="text-lg font-medium text-gray-900">
              LocalDocs
            </span>
          </div>
        </div>

        {/* CENTER: Search Bar */}
        <div className="flex-1 max-w-2xl px-8">
          <div className="relative flex items-center w-full bg-gray-50 rounded-lg h-10 px-3 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-gray-900 border border-gray-200 focus-within:border-transparent">
            <Search size={18} className="text-gray-500" strokeWidth={2} />
            <input
              type="text"
              placeholder="Search documents..."
              className="flex-grow bg-transparent outline-none ml-3 text-sm text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>

        {/* RIGHT: Profile */}
        <div className="flex items-center relative">
          {/* AVATAR BUTTON */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </button>

          {/* PROFILE DROPDOWN */}
          {isMenuOpen && (
            <div 
              ref={menuRef}
              className="absolute top-12 border border-gray-300 right-0 w-72 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-[60]"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gray-900 text-white flex items-center justify-center text-2xl font-medium mb-3">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  
                  <h3 className="text-base font-medium text-gray-900 mb-1">
                    {user?.username}
                  </h3>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  
                  <button className="mt-4 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors">
                    Manage Account
                  </button>
                </div>
              </div>

              <div className="p-2">
                <button 
                  onClick={() => logout()}
                  className="flex items-center w-full gap-3 py-2.5 px-3 hover:bg-gray-50 rounded-lg text-gray-700 transition-colors"
                >
                  <LogOut size={18} strokeWidth={2} />
                  <span className="text-sm font-medium">Sign out</span>
                </button>
              </div>
              
              <div className="flex justify-center gap-3 py-3 text-xs text-gray-500 border-t border-gray-100">
                <button className="hover:text-gray-900 transition-colors">Privacy</button>
                <span>•</span>
                <button className="hover:text-gray-900 transition-colors">Terms</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;