import { Request } from 'express';

export interface IGetUserAuthInfoRequest extends Request {
    user: {
        id: number;
        email: string;
    }
}

export interface IGetUserInfoRequest extends Request {
    user: {
        id: number;
        email: string;
        firstName?: string;
        lastName?: string;
    }
}