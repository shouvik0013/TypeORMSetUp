import { Request, Response, NextFunction } from 'express';
import { SuccessResponse, ErrorResponse} from '../../utils/response';
import { create } from './user.service';

export const signupUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dummyUser = {
            firstName: 'Shouvik',
            lastName: 'Mandal',
            email: 'test1@gmail.com',
            password: 'password@123'
        }

        const serviceResponse = await create(dummyUser);

        if(!serviceResponse.success) {
            return ErrorResponse({
                res,
                data: serviceResponse.data,
                message: serviceResponse.message,
                success: false,
                statusCode: 500
            })
        }

        return SuccessResponse({
            res,
            data: serviceResponse.data,
            message: serviceResponse.message,
            statusCode: 201,
            success: true
        })
    } catch (error) {
        return ErrorResponse({
            res,
            data: error,
            message: error.message,
            statusCode: 500,
            success: false
        })
    }
}