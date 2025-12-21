import { Router } from "express";
import { addCollaborator, createDoc, getDocById, getUserDocs } from "../controllers/doc.controller.js";
import { checkAuth } from "../middlewares/auth.middleware.js";


export const docRouter = Router();


docRouter.post("/create", checkAuth, createDoc);
docRouter.get("/:id", checkAuth, getDocById);
docRouter.get("/user/docs", checkAuth, getUserDocs);
docRouter.post("/add/colaborator", checkAuth, addCollaborator)