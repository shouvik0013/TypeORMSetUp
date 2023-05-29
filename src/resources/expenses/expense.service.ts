import {Repository} from "typeorm";
import {Expense} from "./expense.entity";
import {expensesRepository} from "./expense.repo";
import {usersRepository} from "../user/user.repo";
import {User} from "../user/user.entity";
import {ErrorServiceResponse, SuccessServiceResponse} from "../../utils/service-response";

export const createNewExpense = async (userId: number, title: string, amount: number, expense_date: Date) => {
    try {
        const expense = expensesRepository.create({
            title,
            amount,
            expense_date,
        });

        expense.user = {id: userId} as User;
        //* save the new expense in db
        const savedExpense = await expensesRepository.save(expense);
        console.log("^^^^^^^Saved expense^^^^^^^", savedExpense);
        return SuccessServiceResponse(savedExpense, "expense saved into db", true);
    } catch (error) {
        return ErrorServiceResponse(error, error.message, false);
    }
};

export const getUserExpenses = async (userId: number) => {
    try {
        const user = await usersRepository.findOne({
            where: {
                id: userId,
            },
            relations: {
                expenses: true,
            },
        });

        console.log("^^^^^^^ USER EXPENSE >>>>", user);

        if (!user) {
            return ErrorServiceResponse(null, "Invalid user id", false);
        }

        const {password, ...otherInfo} = user;

        return SuccessServiceResponse(otherInfo, "Expenses fetched", true);
    } catch (error) {
        return ErrorServiceResponse(error, error.message, false);
    }
};
