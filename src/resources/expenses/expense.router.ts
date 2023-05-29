import {Router} from "express";
import {JwtAuthGuard} from "../auth/jwt.strategy";
import {expenseValidationMiddleware} from "../../middlewares/expense-validation.middleware";
import {createExpense, getUserExpenses} from "./expense.controller";
const router = Router();

router.post("/", JwtAuthGuard, expenseValidationMiddleware, createExpense, (err, req, res, next) => {
    next(err);
});

router.get("/", JwtAuthGuard, getUserExpenses, (err, req, res, next) => {
    next(err);
});


router.delete('/:id', JwtAuthGuard);
export default router;
