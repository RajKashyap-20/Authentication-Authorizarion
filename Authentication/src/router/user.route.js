import  Router  from "express";
import {registerUser, verifyEmail, login, forgotPassword, resetPassword} from "../controller/user.controller.js";
import { authorize, authenticate } from "../middleware/auth.middeleware.js";


const router = Router();

router.post("/register", registerUser);
router.get("/verify", verifyEmail);
router.post("/login", login);

// Password reset routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);


router.get("/protected", authenticate, async (req, res) => {
  res.json({ "user": req.user });
});

router.get("/only-admin", authenticate, authorize("admin"),async(req, res)=>{
    res.json({"message":"Only admin can acess this route"});
});

// router.get("/verify", verifyUser);

export default router;