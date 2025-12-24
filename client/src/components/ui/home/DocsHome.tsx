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
      <p className="text-sm text-gray-400 py-8">No documents yet</p>
    );

    if (viewMode === "grid") {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {docs.map((doc) => (
            <GridItem key={doc._id} doc={doc} isShared={isShared} />
          ))}
        </div>
      );
    }

    return (
      <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
        <div className="flex items-center px-5 py-3 text-xs font-medium text-gray-500 border-b border-gray-100 bg-gray-50">
          <span className="flex-1">Name</span>
          <span className="w-44">Owner</span>
          <span className="w-36">Modified</span>
          <span className="w-8"></span>
        </div>
        {docs.map((doc) => (
          <ListItem key={doc._id} doc={doc} isShared={isShared} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* TEMPLATE SECTION */}
      <section className="border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-sm font-medium text-gray-900 mb-5">Start a new document</h2>
          <NavLink to="/dashboard/doc/new" className="inline-block group">
            <div className="w-32 h-40 border border-gray-900 bg-white border border-gray-200 rounded-lg  hover:shadow-sm transition-all flex items-center justify-center">
              <Plus size={32} className="text-gray-900" strokeWidth={2} />
            </div>
            <p className="mt-2 text-sm text-gray-700">Blank</p>
          </NavLink>
        </div>
      </section>

      {/* VIEW CONTROLS */}
      <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between border-b border-gray-300">
        <h2 className="text-sm font-medium text-gray-900">Recent documents</h2>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className="p-2 hover:bg-gray-100 rounded-md text-gray-600 transition-colors"
            title={viewMode === "grid" ? "List view" : "Grid view"}
          >
            {viewMode === "grid" ? <ListIcon size={16} strokeWidth={2} /> : <LayoutGrid size={16} strokeWidth={2} />}
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-md text-gray-600 transition-colors">
            <Folder size={16} strokeWidth={2} />
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-8 py-6 pb-20">
        {/* OWNED BY ME SECTION */}
        <div className="mb-12">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">
            My Documents
          </h3>
          {renderDocs(myDocs, false)}
        </div>

        {/* SHARED WITH ME SECTION */}
        <div>
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">
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
  <NavLink to={`/dashboard/doc/${doc._id}`} className="group block">
    <div className="bg-white border border-gray-200 rounded-lg border-gray-300 hover:shadow-sm transition-all overflow-hidden">
       <div className="h-32 flex items-center justify-center bg-gray-50 border-b border-gray-100">
          <FileText size={32} className="text-gray-400" strokeWidth={1.5} />
       </div>
       <div className="p-3">
          <p className="text-sm font-medium text-gray-900 truncate mb-1">{doc.title || "Untitled"}</p>
          <div className="flex items-center justify-between text-xs text-gray-500">
             <span>{isShared ? doc.creator?.name || 'Shared' : "me"}</span>
             <MoreVertical size={14} strokeWidth={2} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
          </div>
       </div>
    </div>
  </NavLink>
);

const ListItem = ({ doc, isShared }: { doc: any; isShared: boolean }) => (
  <NavLink to={`/dashboard/doc/${doc._id}`} className="flex items-center px-5 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 group transition-colors">
    <div className="flex-1 flex items-center min-w-0">
      <FileText size={16} className="text-gray-400 mr-3 shrink-0" strokeWidth={1.5} />
      <span className="text-sm text-gray-900 truncate">{doc.title || "Untitled"}</span>
    </div>
    <div className="w-44 text-sm text-gray-600">
      {isShared ? (
        <span className="inline-flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
            {doc.creator?.name?.substring(0, 1).toUpperCase() || "U"}
          </span>
          {doc.creator?.name || "Shared"}
        </span>
      ) : (
        <span className="text-gray-500">me</span>
      )}
    </div>
    <div className="w-36 text-sm text-gray-500">
      {new Date(doc.updatedAt).toLocaleDateString()}
    </div>
    <div className="w-8 flex justify-end">
       <MoreVertical size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
    </div>
  </NavLink>
);