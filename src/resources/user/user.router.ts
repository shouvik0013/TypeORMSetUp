import express, {Request, Response, NextFunction} from "express";
import {signupUser, login, loginFailed} from "./user.controller";
import PassportLocal from "../passport-strategies/local";

const router = express.Router();

router.post("/signup", signupUser);

router.post("/login", PassportLocal.authenticate("local", {session: false, failWithError: true}), login, loginFailed);

export default router;
