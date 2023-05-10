import express, {Request, Response, NextFunction} from "express";
import {signupUser, login, loginFailed, getProfile} from "./user.controller";
import PassportLocal from "../passport-strategies/local.strategy";
import PassportJwt from "../passport-strategies/jwt.strategy";
//* MIDDLEWARES
import {userInfoValidationMiddleware} from "../../middlewares/req-validation.middleware";

const router = express.Router();
const JwtAuthGuard = PassportJwt.authenticate("jwt", {session: false, failWithError: true});
const LocalAuthGuard = PassportLocal.authenticate("local", {session: false, failWithError: true});

router.post("/signup", userInfoValidationMiddleware, signupUser);

router.post("/login", LocalAuthGuard, login, loginFailed);

router.get("/profile", JwtAuthGuard, getProfile, (err, req, res, next) => {
    next(err);
});

export default router;
