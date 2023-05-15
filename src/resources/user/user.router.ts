import express, {Request, Response, NextFunction} from "express";
import {signupUser, login, loginFailed, getProfile} from "./user.controller";

//* MIDDLEWARES
import {userInfoValidationMiddleware} from "../../middlewares/req-validation.middleware";
//* AUTH GUARDS
import {LocalAuthGuard} from "../auth/local.strategy";
import {JwtAuthGuard} from "../auth/jwt.strategy";

const router = express.Router();

router.post("/signup", userInfoValidationMiddleware, signupUser);

router.post("/login", LocalAuthGuard, login, loginFailed);

router.get("/profile", JwtAuthGuard, getProfile, (err, req, res, next) => {
    next(err);
});

export default router;
