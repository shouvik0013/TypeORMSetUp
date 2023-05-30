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

export const getExpenseById = async (id: number) => {
    try {
        const expense = await expensesRepository
            .createQueryBuilder("expense")
            .leftJoin("expense.user", "user")
            .addSelect(["user.id", "user.email"])
            .where("expense.id=:id ", {id})
            .getOne();

        console.log("^^^^^^^ Expense with id: ", expense);

        if (!expense) {
            return ErrorServiceResponse(null, "Expense with id not found", false);
        }

        return SuccessServiceResponse(expense, "Expense retrieved", true);
    } catch (error) {
        console.log(error);

        return ErrorServiceResponse(error, error.message, false);
    }
};

export const deleteExpenseById = async (id: number) => {
    try {
        const response = await expensesRepository.delete({
            id
        });

        console.log(response);

        if(response.affected < 1) {
            return ErrorServiceResponse(null, 'Deletion not successfull', false)
        } 



        return SuccessServiceResponse(null, 'deleted', true)
    } catch (error) {
        console.log(error);

        return ErrorServiceResponse(error, error.message, false);
    }
}
