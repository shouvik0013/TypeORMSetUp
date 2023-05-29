import {appDataSource} from '../../../db/data-source';
import {Expense} from './expense.entity';

export const expensesRepository = appDataSource.getRepository(Expense)