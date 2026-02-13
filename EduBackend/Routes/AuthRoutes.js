import express from "express";
import { changePassword, getInfo, login, signUp, updateProfile } from "../Controllers/Authentication.js";
import { protect } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();
router.post("/signup", signUp)
router.post("/login",login)


router.get("/profile",protect,getInfo)
router.put("/updateUser",protect,updateProfile)
router.post("/change-password",protect,changePassword)

export default router;