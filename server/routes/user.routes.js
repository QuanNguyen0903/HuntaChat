import { Router } from "express";
import { checkAuth, loginUser, signUpUser, updateProfile } from "../controllers/user.controller.js";
import { verifyJwt } from "../milddlewares/auth.middleware.js";  // ✅ same name

const userRouter = Router();

userRouter.post("/signup", signUpUser);
userRouter.post("/login", loginUser);
userRouter.put("/update-Profile", verifyJwt, updateProfile);
userRouter.get("/check", verifyJwt, checkAuth);

export default userRouter;
