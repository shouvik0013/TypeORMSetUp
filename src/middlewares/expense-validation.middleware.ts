import Joi from "joi";
import {Request, Response, NextFunction} from "express";
import {ErrorResponse} from "../utils/response";



const isDateValid = (d: Date): Boolean => {
    if (Object.prototype.toString.call(d) === "[object Date]") {
        if( !isNaN(d.getTime())) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

const expense_date_validator = (value: String, options:any) => {
    const current_date = new Date();
    const passed_date = new Date(value.trim());

    

    if(!isDateValid(passed_date)) {
        return options.error('date.invalid')
    } 

    if(passed_date > current_date) {
        return options.error('date.large')
    }

    return passed_date.toISOString().split('T')[0];
    // return '2022-04-04'
}


const schema = Joi.object({
    title: Joi.string().required(),
    amount: Joi.number().required(),
    expense_date: Joi.string().required().custom(expense_date_validator, 'Expense date validation').messages({
        'date.invalid': 'Invalid date',
        'date.large': 'Expense date can\'t be greater than current date'
    }),
});

export const expenseValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const validationResult = schema.validate(body);
    
    

    if (validationResult.error) {
        const details = validationResult.error.details[0];

        return ErrorResponse({
            res,
            statusCode: 422,
            data: {key: details.context.key, value: details.context.value},
            message: details.message,
        });
    }

    body.expense_date = validationResult.value.expense_date;

    next();
};
