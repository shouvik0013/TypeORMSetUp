import {Request, Response, NextFunction} from "express";
import {IGetUserInfoRequest, IRequestExpenseInfo} from "../../interfaces/request.interface";
import {SuccessResponse, ErrorResponse} from "../../utils/response";
import {createNewExpense, getUserExpenses as getExpenses, getExpenseById, deleteExpenseById as removeExpenseById} from "./expense.service";

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


export const deleteExpenseById = async (req: IGetUserInfoRequest, res: Response, next: NextFunction) => {
    try {
        //TODO: Get the id from url
        const expenseId = +req.params['id'];
        //TODO: Fetch the expense with 'id' from database
        const expenseResponse = await getExpenseById(expenseId);

        //TODO: If no expense found send error response
        if(!expenseResponse.success) {
            return ErrorResponse({
                res,
                data: null,
                message: 'No expense found with given id',
                statusCode: 401,
                success: false
            })
        }

        //TODO: If the id of the current loggedin user doesn't match with fetched expenses's userId then don't delete the expense and send error response
        if(req.user.id.toString() !== expenseResponse.data.user.id.toString()) {
            return ErrorResponse({
                res,
                data: null,
                message: 'No permission to delete'
            })
        }

        //TODO: Delete the expense
        const deleteResponse =  await removeExpenseById(expenseId);

        return SuccessResponse({
            res,
            data: deleteResponse.data,
            message: deleteResponse.message
        })


    } catch (error) {
        return ErrorResponse({
            res,
            data: error,
            message: error.message,
            statusCode: 500,
            success: false,
        });
    }
}
