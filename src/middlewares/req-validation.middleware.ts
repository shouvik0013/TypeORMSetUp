import Joi from "joi";
import {Request, Response, NextFunction} from 'express';
import {appDataSource} from "../../db/data-source";
import {User} from "../resources/user/user.entity";
//* INTERFACES
import {IRequestUserInfo} from '../interfaces/request.interface';


const userRepository = appDataSource.getRepository(User);

const duplicateEmailChecker = async (value: string) => {
    const res = await userRepository.find({
        where: {
            email: value,
        },
    });

    if (res.length > 0) {
        throw new Error("Email address already in use");
    }

    return undefined;
};

const schema = Joi.object({
    firstName: Joi.string().min(2).max(50).alphanum().required(),
    lastName: Joi.string().pattern(new RegExp("^[a-zA-Z]*$")),
    email: Joi.string()
        .email({minDomainSegments: 2, tlds: {allow: ["com", "in", "net"]}})
        .external(duplicateEmailChecker)
        .required(),
    password: Joi.string().min(6).max(100).required(),
});

export const userInfoValidationMiddleware = async (req: IRequestUserInfo, res: Response, next: NextFunction) => {
    try {
        const reqBody = req.body;

        await schema.validateAsync(reqBody);
        const userInfo = {
            firstName: reqBody.firstName,
            lastName: reqBody?.lastName,
            email: reqBody.email,
            password: reqBody.password
        }

        req.userInfo = userInfo;
        
        next();
        
    } catch (error) {
        console.log('******** Validation error at req-validation.middleware', error);
        error.statusCode = 400;
        next(error);
    }
}
