import fs from 'fs';
import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'morgan';
import { ErrorResponse } from './utils/response';
import usersRouter from './resources/user/user.router';

interface CustomError extends Error {
	statusCode?: number;
}

const app = express();

const accessLogStream = fs.createWriteStream(
	path.join(__dirname, '..', 'access.log'),
	{
		flags: 'a', // a for append
	}
);

app.use(
	logger('combined', {
		stream: accessLogStream,
	})
);
app.use((req: Request, res: Response, next: NextFunction) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', [
		'OPTIONS',
		'GET',
		'POST',
		'DELETE',
		'PATCH',
		'PUT',
	]);
	res.setHeader('Access-Control-Allow-Headers', [
		'Content-Type',
		'Authorization',
	]);
	next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/users', usersRouter);

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
	ErrorResponse({
		res,
		message: err.message,
		data: err,
		statusCode: err.statusCode ?? 500,
	});
	return {
		message: err.message,
		data: err,
		statusCode: err.statusCode ?? 500,
	};
});

export default app;
