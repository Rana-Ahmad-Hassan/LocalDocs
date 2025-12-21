import React from "react";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { toggleMark, setBlockType, wrapIn } from "prosemirror-commands";
import { schema } from "prosemirror-schema-basic";
import { wrapInList } from "prosemirror-schema-list";
import {
  Bold,
  Italic,
  Code,
  Heading1,
  Heading2,
  List,
  Quote,
  Undo,
  Redo,
} from "lucide-react";
import { undo, redo } from "prosemirror-history";

import { Share2 } from "lucide-react"; // Import Share icon

// ... in your EditorToolbar props, add a function to open the modal
interface ToolbarProps {
  editorView: EditorView | null;
  onShareClick: () => void; // Add this
}

// Helper to check if a mark (like bold) is active
const isMarkActive = (state: EditorState, markType: any) => {
  const { from, $from, to, empty } = state.selection;
  if (empty) return markType.isInSet(state.storedMarks || $from.marks());
  return state.doc.rangeHasMark(from, to, markType);
};

interface ToolbarProps {
  editorView: EditorView | null;
}

const ToolbarButton = ({
  onClick,
  isActive = false,
  disabled = false,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}) => (
  <button
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
    disabled={disabled}
    className={`
      p-1.5 rounded text-sm transition-colors
      ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}
      ${isActive ? "bg-blue-100 text-blue-700" : "text-gray-700"}
    `}
  >
    {children}
  </button>
);

export const EditorToolbar = ({ editorView, onShareClick }: ToolbarProps) => {
  if (!editorView) return null;

  const { state, dispatch } = editorView;

  const toggleBold = () => toggleMark(schema.marks.strong)(state, dispatch);
  const toggleItalic = () => toggleMark(schema.marks.em)(state, dispatch);
  const toggleCode = () => toggleMark(schema.marks.code)(state, dispatch);
  const toggleH1 = () =>
    setBlockType(schema.nodes.heading, { level: 1 })(state, dispatch);
  const toggleH2 = () =>
    setBlockType(schema.nodes.heading, { level: 2 })(state, dispatch);
  const toggleBulletList = () =>
    wrapInList(schema.nodes.bullet_list)(state, dispatch);
  const toggleBlockquote = () =>
    wrapIn(schema.nodes.blockquote)(state, dispatch);

  return (
    <div className="flex items-center gap-1 px-4 py-2 border-b border-gray-300 bg-[#edf2fa] sticky top-0 z-10 rounded-t-xl mx-4 mt-4">
      {/* History */}
      <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
        <ToolbarButton
          onClick={() => undo(state, dispatch)}
          disabled={!undo(state)}
        >
          <Undo size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => redo(state, dispatch)}
          disabled={!redo(state)}
        >
          <Redo size={18} />
        </ToolbarButton>
      </div>

      {/* Formatting */}
      <ToolbarButton
        onClick={toggleBold}
        isActive={isMarkActive(state, schema.marks.strong)}
      >
        <Bold size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={toggleItalic}
        isActive={isMarkActive(state, schema.marks.em)}
      >
        <Italic size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={toggleCode}
        isActive={isMarkActive(state, schema.marks.code)}
      >
        <Code size={18} />
      </ToolbarButton>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Headings */}
      <ToolbarButton onClick={toggleH1} isActive={false}>
        {" "}
        {/* Checking heading active state is complex, skipped for brevity */}
        <Heading1 size={18} />
      </ToolbarButton>
      <ToolbarButton onClick={toggleH2} isActive={false}>
        <Heading2 size={18} />
      </ToolbarButton>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Lists */}
      <ToolbarButton onClick={toggleBulletList} isActive={false}>
        <List size={18} />
      </ToolbarButton>
      <ToolbarButton onClick={toggleBlockquote} isActive={false}>
        <Quote size={18} />
      </ToolbarButton>

      <div className="flex justify-end">
        <button
          onClick={onShareClick}
          className="flex items-center gap-2 px-4 py-1.5 bg-[#c2e7ff] hover:bg-[#b3d7ef] text-[#001d35] rounded-full font-medium transition-all text-sm"
        >
          <Share2 size={16} />
          Share
        </button>
      </div>
    </div>
  );
};
