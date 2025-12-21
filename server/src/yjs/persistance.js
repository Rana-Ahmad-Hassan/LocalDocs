import { setPersistence } from "./utils.js";
import Doc from "../models/doc.model.js";
import * as Y from 'yjs';


export const mongoPersistence = () => {
    setPersistence({
        bindState: async (docName, ydoc) => {
            console.log("Loading document:", docName);

            const record = await Doc.findById(docName);
            if (record?.ydoc) {
                Y.applyUpdate(ydoc, new Uint8Array(record.ydoc));
            }


            let timeout;
            ydoc.on('update', async (update) => {
                if (timeout) clearTimeout(timeout);
                timeout = setTimeout(async () => {
                    try {
                        const existingRecord = await Doc.findById(docName);
                        if (existingRecord) {
                            existingRecord.ydoc = Buffer.from(Y.encodeStateAsUpdate(ydoc));
                            await existingRecord.save();
                        } else {
                            const newRecord = new Doc({
                                _id: docName,
                                ydoc: Buffer.from(Y.encodeStateAsUpdate(ydoc)),
                            });
                            await newRecord.save();
                        }
                    } catch (error) {
                        console.error("Error saving document:", error);
                    }
                }, 5000);
            });
        },
        writeState: async (docName, ydoc) => {
            // Full merged state when last client disconnects
            const fullUpdate = Y.encodeStateAsUpdate(ydoc); // Uint8Array
            await Doc.findByIdAndUpdate(docName, { ydoc: Buffer.from(fullUpdate) });
        },
    });
}