import { DataSource } from 'typeorm';
import path from 'path';

// console.log(path.resolve(`${__dirname}/../../**/**.entity{.ts,.js}`));
// console.log('>>>>>>>>', process.env.DB_NAME);

export const appDataSource = new DataSource({
    type: 'sqlite',
    database: process.env.DB_NAME as string,
    entities: ['**/**/*.entity{.ts,.js}'],
    migrations:['db/migrations/*.{ts,js}'],
    synchronize: false
});