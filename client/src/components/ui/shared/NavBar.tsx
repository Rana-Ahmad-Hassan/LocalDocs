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
    <header className="sticky top-0 z-50 bg-white border-b border-[#dadce0] px-4">
      <div className="flex items-center justify-between h-[64px]">
        
        {/* LEFT: Logo & Menu */}
        <div className="flex items-center flex-shrink-0">
          <div className="flex items-center ml-2 cursor-pointer">
            <FileText size={40} className="text-[#4285F4]" />
            <span className="text-[22px] text-[#5f6368] ml-2 font-normal tracking-tight">
              LocalDocs
            </span>
          </div>
        </div>

        {/* CENTER: Search Bar */}
        <div className="flex-1 max-w-[720px] px-8">
          <div className="relative group flex items-center w-full bg-[#f1f3f4] rounded-lg h-[48px] px-4 transition-all focus-within:bg-white focus-within:shadow-md border border-transparent focus-within:border-[#dfe1e5]">
            <Search size={20} className="text-[#5f6368]" />
            <input
              type="text"
              placeholder="Search"
              className="flex-grow bg-transparent outline-none ml-4 text-[16px] text-gray-700 placeholder-[#5f6368]"
            />
          </div>
        </div>

        {/* RIGHT: Profile & Utilities */}
        <div className="flex items-center gap-1 relative">
          

          {/* AVATAR BUTTON */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="ml-2 w-9 h-9 rounded-full bg-[#A5673F] text-white flex items-center justify-center text-sm font-medium hover:ring-4 hover:ring-gray-100 transition-all"
          >
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </button>

          {/* GOOGLE STYLE PROFILE POPOVER */}
          {isMenuOpen && (
            <div 
              ref={menuRef}
              className="absolute top-12 right-0 w-[300px] bg-[#e9eef6] rounded-[28px] shadow-xl border border-gray-300 p-4 z-[60] mt-2"
            >
              <div className="bg-white rounded-[24px] p-6 flex flex-col items-center ">
                <span className="text-sm text-gray-600 font-medium mb-4">{user?.email}</span>
                
                <div className="w-20 h-20 rounded-full bg-[#A5673F] text-white flex items-center justify-center text-3xl mb-3">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                
                <h2 className="text-xl text-[#202124] font-normal">Hi, {user?.username}!</h2>
                
                <button className="mt-4 px-6 py-2 border border-gray-300 rounded-full text-sm font-medium text-[#0b57d0] hover:bg-[#f1f3f4] transition">
                  Manage your Account
                </button>

                <div className="w-full border-t border-gray-100 mt-6 pt-4">
                  <button 
                    onClick={() => logout()}
                    className="flex items-center justify-center w-full gap-2 py-3 px-4 hover:bg-gray-50 rounded-lg text-gray-700 transition"
                  >
                    <LogOut size={18} />
                    <span className="text-sm font-medium">Sign out</span>
                  </button>
                </div>
              </div>
              
              <div className="flex justify-center gap-4 py-3 text-[12px] text-gray-600">
                <span className="hover:underline cursor-pointer">Privacy Policy</span>
                <span>•</span>
                <span className="hover:underline cursor-pointer">Terms of Service</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;