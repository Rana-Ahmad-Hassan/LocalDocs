import { useEffect, useMemo, useRef, useState } from "react";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema } from "prosemirror-model";
import { schema } from "prosemirror-schema-basic";
import { addListNodes } from "prosemirror-schema-list";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";
import "prosemirror-view/style/prosemirror.css";
import { EditorToolbar } from "./ToolBar";
import { ShareModal } from "../ui/modals/ShareModal";
import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import { MessageSquarePlus, Send, X } from "lucide-react";

// Yjs
import * as Y from "yjs";
import {
  ySyncPlugin,
  yUndoPlugin,
  undo,
  redo,
  yCursorPlugin,
} from "y-prosemirror";
import { WebsocketProvider } from "y-websocket";

import { useParams } from "react-router";
import { useAuth } from "../../context/authContext";

const mySchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
  marks: schema.spec.marks,
});

export const GoogleDocsEditor = ({ handleAddColaborator }: any) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [editorView, setEditorView] = useState<EditorView | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState("");

  // Floating UI States
  const [floatingPos, setFloatingPos] = useState<{ top: number } | null>(null);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [tempCommentText, setTempCommentText] = useState("");

  const { id } = useParams();
  const { user } = useAuth();

  const ydoc = useMemo(() => new Y.Doc(), []);

  // 2. GET THE PERSISTENT MAP
  const yComments = ydoc.getMap("comments");

  useEffect(() => {
    if (!editorRef.current) return;

    const yXmlFragment = ydoc.getXmlFragment("prosemirror");
    const provider = new WebsocketProvider("ws://localhost:5000", id!, ydoc);
    const awareness = provider.awareness;

    awareness.setLocalStateField("user", {
      name: user?.username,
      color: "#ffcc00",
    });

    // Selection Tracking Plugin (Google Docs Style)
    const selectionPlugin = new Plugin({
      view() {
        return {
          update(view) {
            const { from, to } = view.state.selection;
            if (from !== to) {
              const coords = view.coordsAtPos(to);
              setFloatingPos({ top: coords.top });
            } else {
              setFloatingPos(null);
              setIsInputVisible(false);
            }
          },
        };
      },
    });

    const state = EditorState.create({
      schema: mySchema,
      plugins: [
        ySyncPlugin(yXmlFragment),
        yUndoPlugin(),
        yCursorPlugin(awareness),
        keymap({
          "Mod-z": undo,
          "Mod-y": redo,
          "Mod-Shift-z": redo,
        }),
        keymap(baseKeymap),
        commentHighlightPlugin(yComments),
        selectionPlugin,
      ],
    });

    const view = new EditorView(editorRef.current, {
      state,
      attributes: {
        class: "prose m-5 focus:outline-none min-h-[500px] w-full max-w-none",
      },
    });

    viewRef.current = view;
    setEditorView(view);

    return () => {
      view.destroy();
      ydoc.destroy();
    };
  }, []);

  // Keep your original function name
  const addComment = (text: string) => {
    if (!editorView) return;
    const { from, to } = editorView.state.selection;
    if (from == to) {
      alert("Please select some text");
      return;
    }
    const comment = {
      id: crypto.randomUUID(),
      author: user?._id,
      authorName: user?.username, // Added for UI display
      text,
      from,
      to,
      resolved: false,
      createdAt: Date.now(),
    };
    yComments.set(String(comment.id), comment);

    // Clear Floating UI
    setTempCommentText("");
    setIsInputVisible(false);
  };

  function commentHighlightPlugin(yComments: any) {
    return new Plugin({
      props: {
        decorations(state) {
          const decorations: any = [];

          yComments.forEach((comment: any) => {
            if (comment.resolved) return;

            decorations.push(
              Decoration.inline(comment.from, comment.to, {
                class: "bg-yellow-200 border-b border-yellow-400",
              })
            );
          });

          return DecorationSet.create(state.doc, decorations);
        },
      },
    });
  }

  // Keep your original function name
  const handleGetSelectedCommentId = (id: string) => {
    setSelectedCommentId(id);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#f9fbfd] relative">
      <EditorToolbar
        editorView={editorView}
        yComments={yComments}
        addComment={addComment}
        onShareClick={() => setIsShareModalOpen(true)}
        getSelectedCommentId={handleGetSelectedCommentId}
      />

      <div className="flex justify-center py-8   relative">
        <div className="bg-white border border-gray-300 w-full max-w-[816px] min-h-[900px] shadow-sm border border-gray-200 relative">
          <div ref={editorRef} />

          {/* FLOATING COMMENT BUTTON */}
          {floatingPos && !isInputVisible && (
            <button
              onClick={() => setIsInputVisible(true)}
              className="fixed z-50 p-2 bg-white text-blue-600 rounded-full shadow-lg border border-gray-200 hover:scale-110 transition-all"
              style={{ top: floatingPos.top - 15, left: "calc(50% + 420px)" }}
            >
              <MessageSquarePlus size={20} />
            </button>
          )}

          {/* FLOATING COMMENT INPUT */}
          {isInputVisible && (
            <div
              className="fixed  w-64 bg-white rounded-xl shadow-2xl border border-gray-300 p-4"
              style={{
                top: floatingPos ? floatingPos.top - 20 : 100,
                left: "calc(50% + 425px)",
              }}
            >
              <textarea
                autoFocus
                value={tempCommentText}
                onChange={(e) => setTempCommentText(e.target.value)}
                placeholder="Type your comment..."
                className="w-full rounded-xl p-3 text-sm border-none focus:ring-0 p-0 mb-3 resize-none min-h-[60px]"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsInputVisible(false)}
                  className="text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => addComment(tempCommentText)}
                  className="bg-blue-600 cursor-pointer text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
                >
                  Comment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        docId={id || "default"}
        handleAddColaborator={handleAddColaborator}
      />
    </div>
  );
};
