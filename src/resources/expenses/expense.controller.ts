import {Request, Response, NextFunction} from "express";
import {IGetUserInfoRequest, IRequestExpenseInfo} from "../../interfaces/request.interface";
import {SuccessResponse, ErrorResponse} from "../../utils/response";
import {createNewExpense, getUserExpenses as getExpenses} from "./expense.service";

export const createExpense = async (req: IRequestExpenseInfo, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const body = req.body;

        body.expense_date = new Date(body.expense_date);

        body.expense_date.setHours(0, 0, 0);

        const response = await createNewExpense(user.id, body.title, body.amount, body.expense_date);

        if (!response.success) {
            return ErrorResponse({
                res,
                data: response.data,
                message: response.message,
                statusCode: 402,
                success: response.success,
            });
        }

        return SuccessResponse({
            res,
            data: response.data,
            message: response.message,
            statusCode: 201,
            success: response.success,
        });
    } catch (error) {
        return ErrorResponse({
            res,
            data: error,
            message: error.message,
            statusCode: 500,
            success: false,
        });
    }
};

export const getUserExpenses = async (req: IGetUserInfoRequest, res: Response, next: NextFunction) => {
    try {
        const response = await getExpenses(req.user.id);
        if (!response.success) {
            return ErrorResponse({res, ...response});
        }
        return SuccessResponse({
            res,
            ...response,
        });
    } catch (error) {
        return ErrorResponse({
            res,
            data: error,
            message: error.message,
            statusCode: 500,
            success: false,
        });
    }
};
