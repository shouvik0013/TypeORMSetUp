import express, { Request, Response, NextFunction } from 'express';
import { appDataSource } from '../db/data-source';
import { User } from './models/user.entity';

let server;
const app = express();
app.get('/', main);

async function main(req: Request, res: Response, next: NextFunction) {
	try {
		const userRepo = appDataSource.getRepository(User);
		const user = userRepo.create({
			firstName: 'Shouvik',
			lastName: 'Mandal',
		});
		const savedUser = await userRepo.save(user);
		res.status(201).json({ success: true, data: savedUser });
		server.close();
	} catch (err) {
		console.log(err);
		server.close();
        appDataSource.destroy();
	}
}

appDataSource
	.initialize()
	.then((result) => {
		server = app.listen(process.env.PORT);
		console.log('App started listening...');
	})
	.catch((err) => {
		console.error(err);
	});
