import {Request, Response, NextFunction} from "express";
import {SuccessResponse, ErrorResponse} from "../../utils/response";
import {create} from "./user.service";
import {login as loginService} from "./auth.service";
//* INTERFACES
import {IGetUserAuthInfoRequest, IGetUserInfoRequest, IRequestUserInfo} from "../../interfaces/request.interface";
//* CUSTOM EXCEPTIONS
import {InvalidCredentials} from "../../utils/CustomExceptions";

export const signupUser = async (req: IRequestUserInfo, res: Response, next: NextFunction) => {
    try {
        const userInfo = req.userInfo;
        // const dummyUser = {
        //     firstName: "Shouvik",
        //     lastName: "Mandal",
        //     email: "test1@gmail.com",
        //     password: "password@123",
        // };

        const serviceResponse = await create(userInfo);

        if (!serviceResponse.success) {
            return ErrorResponse({
                res,
                data: serviceResponse.data,
                message: serviceResponse.message,
                success: false,
                statusCode: 500,
            });
        }

        return SuccessResponse({
            res,
            data: serviceResponse.data,
            message: serviceResponse.message,
            statusCode: 201,
            success: true,
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

export const login = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {
        console.log(">>>>>>>>>>>>>. user.controller");
        if (!req.user) {
            return ErrorResponse({
                res,
                data: null,
                message: "Not authenticated",
                statusCode: 401,
                success: false,
            });
        }

        const loginServiceResponse = await loginService(req.user);

        if (!loginServiceResponse.success) {
            return ErrorResponse({
                res,
                data: loginServiceResponse.data,
                message: loginServiceResponse.message,
                statusCode: 400,
                success: false,
            });
        }

        return SuccessResponse({
            res,
            data: {
                token: loginServiceResponse.data,
                email: req.user.email,
            },
            message: "Login successfull",
            statusCode: 200,
            success: true,
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

export const loginFailed = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const error = new InvalidCredentials("Invalid email or password", 401);
    next(error);
};

export const getProfile = (req: IGetUserInfoRequest, res: Response, next: NextFunction) => {
    return SuccessResponse({
        res,
        data: req.user,
        message: "User info",
        statusCode: 200,
        success: true,
    });
};
