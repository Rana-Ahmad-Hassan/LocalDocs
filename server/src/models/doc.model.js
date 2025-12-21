import mongoose from "mongoose";

const docSchema = new mongoose.Schema({
    title: {
        type: String,
        default: "Untitled Document"
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    ydoc: {
        type: Buffer
    },
    collaborators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],
}, { timestamps: true });

const Doc = mongoose.model("Doc", docSchema);

export default Doc;