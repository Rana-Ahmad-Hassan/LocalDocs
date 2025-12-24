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
import CommentSidebar from "../ui/Comments";

import { Share2 } from "lucide-react";

interface ToolbarProps {
  editorView: EditorView | null;
  onShareClick: () => void;
  addComment: (text: string) => void;
  yComments: any;
  getSelectedCommentId: (id: string) => void;
  resolveComment: (id: string) => void;
}

// Helper to check if a mark (like bold) is active
const isMarkActive = (state: EditorState, markType: any) => {
  const { from, $from, to, empty } = state.selection;
  if (empty) return markType.isInSet(state.storedMarks || $from.marks());
  return state.doc.rangeHasMark(from, to, markType);
};

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
      p-2 rounded transition-colors
      ${disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"}
      ${isActive ? "bg-gray-900 text-white" : "text-gray-700"}
    `}
  >
    {children}
  </button>
);

export const EditorToolbar = ({
  editorView,
  onShareClick,
  addComment,
  yComments,
  getSelectedCommentId,
  resolveComment,
}: ToolbarProps) => {
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
    <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white sticky top-0 z-10">
      <div className="flex items-center gap-1">
        {/* History */}
        <div className="flex gap-0.5 border-r border-gray-200 pr-3 mr-3">
          <ToolbarButton
            onClick={() => undo(state, dispatch)}
            disabled={!undo(state)}
          >
            <Undo size={18} strokeWidth={2} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => redo(state, dispatch)}
            disabled={!redo(state)}
          >
            <Redo size={18} strokeWidth={2} />
          </ToolbarButton>
        </div>

        {/* Formatting */}
        <ToolbarButton
          onClick={toggleBold}
          isActive={isMarkActive(state, schema.marks.strong)}
        >
          <Bold size={18} strokeWidth={2} />
        </ToolbarButton>
        <ToolbarButton
          onClick={toggleItalic}
          isActive={isMarkActive(state, schema.marks.em)}
        >
          <Italic size={18} strokeWidth={2} />
        </ToolbarButton>
        <ToolbarButton
          onClick={toggleCode}
          isActive={isMarkActive(state, schema.marks.code)}
        >
          <Code size={18} strokeWidth={2} />
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-200 mx-2" />

        {/* Headings */}
        <ToolbarButton onClick={toggleH1} isActive={false}>
          <Heading1 size={18} strokeWidth={2} />
        </ToolbarButton>
        <ToolbarButton onClick={toggleH2} isActive={false}>
          <Heading2 size={18} strokeWidth={2} />
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-200 mx-2" />

        {/* Lists */}
        <ToolbarButton onClick={toggleBulletList} isActive={false}>
          <List size={18} strokeWidth={2} />
        </ToolbarButton>
        <ToolbarButton onClick={toggleBlockquote} isActive={false}>
          <Quote size={18} strokeWidth={2} />
        </ToolbarButton>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onShareClick}
          className="flex items-center gap-2 px-4 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors text-sm"
        >
          <Share2 size={16} strokeWidth={2} />
          Share
        </button>
        <CommentSidebar
          addComment={addComment}
          yComments={yComments}
          getSelectedCommentId={getSelectedCommentId}
          resolveComment={resolveComment}
        />
      </div>
    </div>
  );
};