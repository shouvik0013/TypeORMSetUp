import {User} from './user.entity';
import {appDataSource} from '../../../db/data-source';


export const usersRepository = appDataSource.getRepository(User);