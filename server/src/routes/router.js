import {Router} from "express";
import {login,register,logout} from "../controllers/authController.js";
import authMiddleware from "../middlewares/authmiddleware.js";

const router = Router();


router.post("/login",login)
router.post("/register",register)
router.post("/logout",authMiddleware,logout)
router.get("/whoami",authMiddleware,(req,res)=>{
    res.json(req.user)
})  


export default router;