import { Router } from "express";
import {
    getall,
    login,
    one,
    register,
    updated,
} from "../Controllers/UserController";
import { decodeToken } from "../helpers/secure/Jwt";
const router = Router();

router.post("/register",  register);
router.post("/login", login);
router.get("/all",decodeToken, getall);
router.get("/one/:userid",decodeToken, one);
router.put("/update/:id",decodeToken, updated);

export default router;