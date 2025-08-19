import { Router } from "express";
import { verifyJwt } from "../milddlewares/auth.middleware.js";
import { getMessages, getUsersForSidebar, markMessageAsSeen, sendMessage } from "../controllers/message.controller.js";

const messageRouter = Router();

messageRouter.get("/users",verifyJwt,getUsersForSidebar)
messageRouter.get("/:id",verifyJwt,getMessages)
messageRouter.put("/mark/:id",verifyJwt,markMessageAsSeen  )
messageRouter.post("/send/:id",verifyJwt,sendMessage  )

export default messageRouter