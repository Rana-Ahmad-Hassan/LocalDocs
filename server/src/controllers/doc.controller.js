import Doc from "../models/doc.model.js";
import User from "../models/user.model.js";


export const createDoc = async (req, res) => {
    try {
        console.log(req.user)
        const id = req.user;
        const newDoc = new Doc({
            title: "Untitled Document",
            creator: id
        });
        await newDoc.save();
        res.status(201).json(newDoc);
    } catch (error) {
        console.error("Error creating document:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getDocById = async (req, res) => {
    const { id } = req.params;
    try {
        const doc = await Doc.findById(id);
        if (!doc) {
            return res.status(404).json({ message: "Document not found" });
        }
        res.status(200).json(doc);
    } catch (error) {
        console.error("Error fetching document:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getUserDocs = async (req, res) => {
    const userId = req.user; // Ensure this is the ID string

    try {
        // 1. Fetch all documents where user is involved
        const allDocs = await Doc.find({
            $or: [
                { creator: userId },
                { collaborators: userId }
            ]
        })
            .populate("creator", "-password")
            .sort({ updatedAt: -1 });

        // 2. Separate into two arrays using JavaScript filter
        // We use .toString() to compare MongoDB ObjectIds accurately
        const myDocs = allDocs.filter(
            doc => doc.creator._id.toString() === userId.toString()
        );

        const sharedDocs = allDocs.filter(
            doc => doc.creator._id.toString() !== userId.toString()
        );

        // 3. Return both arrays in a single object
        res.status(200).json({
            myDocs,
            sharedDocs
        });

    } catch (error) {
        console.error("Error fetching user documents:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const addCollaborator = async (req, res) => {
    try {
        const { docId, email } = req.body;

        const document = await Doc.findById(docId);
        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }

        const userToAdd = await User.findOne({ email });
        if (!userToAdd) {
            return res.status(404).json({ message: "User with this email does not exist" });
        }

        if (document.collaborators.includes(userToAdd._id)) {
            return res.status(400).json({ message: "User is already a collaborator" });
        }

        document.collaborators.push(userToAdd._id);
        await document.save();

        res.status(200).json({
            message: "Collaborator added successfully",
            user: {
                name: userToAdd.name,
                email: userToAdd.email
            }
        });

    } catch (error) {
        console.error("Add Collaborator Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};