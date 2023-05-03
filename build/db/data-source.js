"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appDataSource = void 0;
var typeorm_1 = require("typeorm");
// console.log(path.resolve(`${__dirname}/../../**/**.entity{.ts,.js}`));
console.log('>>>>>>>>', process.env.DB_NAME);
exports.appDataSource = new typeorm_1.DataSource({
    type: 'sqlite',
    database: process.env.DB_NAME,
    entities: ['**/**/*.entity{.ts,.js}'],
    migrations: ['**/**/db/migrations/*.{js,ts}']
});
