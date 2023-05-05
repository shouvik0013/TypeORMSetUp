import { Request, Response, NextFunction } from 'express';

export interface ServerResponse {
	message: string;
	success: boolean;
	statusCode: number;
	data: any;
}

interface ResponseArgs {
	res: Response;
	message?: string;
	success?: boolean;
	statusCode?: number;
	data?: any;
}

export const SuccessResponse = (args: ResponseArgs): ServerResponse => {
	let message = args.message ?? 'Success';
	let success = args.success ?? true;
	let statusCode = args.statusCode ?? 200;
	let data = args.data ?? {};
	let res = args.res;

	res.status(statusCode).json({ message, success, statusCode, data });
	return {
		message,
		success,
		statusCode,
		data,
	};
};

export const ErrorResponse = (args: ResponseArgs): ServerResponse => {
	let message = args.message ?? 'Error';
	let success = args.success ?? false;
	let statusCode = args.statusCode ?? 500;
	let data = args.data ?? {};
	let res = args.res;

	res.status(statusCode).json({ message, success, statusCode, data });
	return {
		message,
		success,
		statusCode,
		data,
	};
};
