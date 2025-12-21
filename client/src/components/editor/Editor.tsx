import { useEffect, useRef, useState } from "react";
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
  const { id } = useParams();
  const {user} = useAuth()
  console.log(user)

  useEffect(() => {
    if (!editorRef.current) return;

    const ydoc = new Y.Doc();
    const yXmlFragment = ydoc.getXmlFragment("prosemirror");
    const provider = new WebsocketProvider("ws://localhost:5000", id!, ydoc);
    const awareness = provider.awareness;

    awareness.setLocalStateField("user", {
      name: user?.username,
      color: "#ffcc00",
    });

    awareness.on("change", () => {
      const states = awareness.getStates();
      states.forEach((state, clientID) => {
        console.log(`User ${clientID} is at cursor:`, state.cursor);
      });
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

  return (
    <div className="flex flex-col h-screen w-full bg-[#f9fbfd]">
      <EditorToolbar
        editorView={editorView}
        onShareClick={() => setIsShareModalOpen(true)}
      />
      <div className="flex justify-center py-8">
        <div className="bg-white border border-gray-300 w-full max-w-[816px] min-h-[900px] shadow-sm border border-gray-200">
          <div ref={editorRef} />
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
