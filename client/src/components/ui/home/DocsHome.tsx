import React, { useState } from "react";
import {
  Folder,
  List as ListIcon,
  LayoutGrid,
  Plus,
  FileText,
  MoreVertical,
  User as UserIcon,
  ChevronDown,
} from "lucide-react";
import { NavLink } from "react-router";

interface UserDocs {
  myDocs: any[];
  sharedDocs: any[];
}

interface DocsHomePageProps {
  userDocs: UserDocs;
}

export const DocsHomePage: React.FC<DocsHomePageProps> = ({ userDocs }) => {
  const { myDocs = [], sharedDocs = [] } = userDocs || {};
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const renderDocs = (docs: any[], isShared: boolean) => {
    if (docs.length === 0) return (
      <p className="text-sm text-gray-500 py-4 italic">No documents found in this section.</p>
    );

    if (viewMode === "grid") {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {docs.map((doc) => (
            <GridItem key={doc._id} doc={doc} isShared={isShared} />
          ))}
        </div>
      );
    }

    return (
      <div className="border-t border-[#dadce0]">
        <div className="flex items-center px-4 py-2 text-[13px] font-medium text-[#5f6368] border-b bg-gray-50">
          <span className="flex-1">Name</span>
          <span className="w-48 text-center">Owner</span>
          <span className="w-40">Last updated</span>
          <span className="w-10"></span>
        </div>
        {docs.map((doc) => (
          <ListItem key={doc._id} doc={doc} isShared={isShared} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#202124]">
      {/* TEMPLATE SECTION */}
      <section className="bg-[#F1F3F4] border-b border-[#dadce0] pb-8 pt-4">
        <div className="max-w-[1100px] mx-auto px-6">
          <h2 className="text-base font-normal text-[#202124] py-4">Start a new document</h2>
          <div className="w-[150px] group cursor-pointer">
            <div className="aspect-[1/1.3] bg-white border border-[#dadce0] rounded hover:border-[#4285F4] transition-all flex items-center justify-center shadow-sm">
              <Plus size={48} className="text-red-500" />
            </div>
            <p className="mt-2 text-sm font-medium text-[#3c4043]">Blank</p>
          </div>
        </div>
      </section>

      {/* VIEW CONTROLS */}
      <div className="max-w-[1100px] mx-auto px-6 mt-6 flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-800">Recent documents</h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className="p-2 hover:bg-gray-100 rounded-full text-[#5f6368]"
            title={viewMode === "grid" ? "List view" : "Grid view"}
          >
            {viewMode === "grid" ? <ListIcon size={20} /> : <LayoutGrid size={20} />}
          </button>
          <Folder size={20} className="text-[#5f6368] mx-2 cursor-pointer" />
        </div>
      </div>

      <main className="max-w-[1100px] mx-auto px-6 pb-20">
        {/* OWNED BY ME SECTION */}
        <div className="mt-8">
          <h3 className="text-xs font-bold text-[#5f6368] uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Owned by me
          </h3>
          {renderDocs(myDocs, false)}
        </div>

        {/* SHARED WITH ME SECTION */}
        <div className="mt-16">
          <h3 className="text-xs font-bold text-[#5f6368] uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Shared with me
          </h3>
          {renderDocs(sharedDocs, true)}
        </div>
      </main>
    </div>
  );
};

/* --- SHARED COMPONENTS --- */

const GridItem = ({ doc, isShared }: { doc: any; isShared: boolean }) => (
  <NavLink to={`/dashboard/doc/${doc._id}`}  className="group block">
    <div className="aspect-[1/1.3] bg-white border border-[#dadce0] rounded hover:border-[#4285F4] transition shadow-sm overflow-hidden flex flex-col">
       <div className="flex-1 flex items-center justify-center bg-[#f8f9fa]">
          <FileText size={44} className="text-[#4285F4]" />
       </div>
       <div className="p-3 bg-white border-t border-[#dadce0]">
          <p className="text-sm font-medium text-[#202124] truncate">{doc.title || "Untitled"}</p>
          <div className="flex items-center justify-between mt-1 text-[11px] text-[#5f6368]">
             <span>{isShared ? `By ${doc.creator?.name || 'User'}` : "me"}</span>
             <MoreVertical size={14} />
          </div>
       </div>
    </div>
  </NavLink>
);

const ListItem = ({ doc, isShared }: { doc: any; isShared: boolean }) => (
  <NavLink to={`/dashboard/doc/${doc._id}`} className="flex items-center px-4 py-3 border-b border-[#dadce0] hover:bg-[#e8f0fe] group">
    <div className="flex-1 flex items-center min-w-0">
      <FileText size={18} className="text-[#4285F4] mr-4 shrink-0" />
      <span className="text-sm font-medium text-[#202124] truncate">{doc.title || "Untitled"}</span>
    </div>
    <div className="w-48 text-center text-sm text-[#3c4043]">
      {isShared ? (
        <span className="bg-gray-100 px-2 py-0.5 rounded text-[12px]">{doc.creator?.name || "Shared"}</span>
      ) : (
        <span className="text-[#5f6368]">me</span>
      )}
    </div>
    <div className="w-40 text-sm text-[#5f6368]">
      {new Date(doc.updatedAt).toLocaleDateString()}
    </div>
    <div className="w-10 flex justify-end">
       <MoreVertical size={16} className="text-[#5f6368] opacity-0 group-hover:opacity-100" />
    </div>
  </NavLink>
);