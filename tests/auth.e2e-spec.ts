import request from "supertest";
import {appDataSource} from "../db/data-source";
import {Repository} from "typeorm";
import {User} from "../src/resources/user/user.entity";
import {ErrorResponse, SuccessResponse, ServerResponse} from "../src/utils/response";
import app from "../src/app";

describe("Authentication system", function () {
    let userRepo: Repository<User>;
    beforeAll(async () => {
        try {
            await appDataSource.initialize();
            userRepo = appDataSource.getRepository(User);
            return;
        } catch (error) {
            console.log("************* Database initialization failed ******************");
            console.log(error.message);
            return;
        }
    });

    afterAll(async () => {
        await userRepo.clear();
        return appDataSource.destroy();
    });

    beforeEach(async () => {
        await userRepo.clear();
        return;
    });

    it("handles signup request", async function () {
        try {
            const usr = {
                firstName: "Test",
                lastName: "Mandal",
                email: "test@gmail.com",
                password: "password@123",
            };

            return request(app)
                .post("/users/signup")
                .send(usr)
                .expect(201)
                .then(response => {
                    console.log(`Response is`, response);
                    expect(response.body).toHaveProperty("success", true);
                });
        } catch (error) {}
    });

    it("should not create a new user if proper info is not provided", async function () {
        try {
            const user = {
                firstName: "Test",
                lastName: "Mandal",
                password: "password@123",
            };

            return request(app).post("/users/signup").send(user).expect(400);
        } catch (error) {}
    });

    it("should return with a token if login success", async function () {
        try {
            const usr = {
                firstName: "Test",
                lastName: "Mandal",
                email: "test@gmail.com",
                password: "password@123",
            };

            //* creating a new user
            await request(app).post("/users/signup").send(usr).expect(201);

            const response = await request(app)
                .post("/users/login")
                .send({email: usr.email, password: usr.password})
                .expect(200);
            console.log(response.body);

            const {body} = response;
            expect(body).toHaveProperty("success", true);
            expect(body).toHaveProperty("token");
        } catch (error) {}
    });

    it("should return current logged in user's info", async function () {
        try {
            const usr = {
                firstName: "Test",
                lastName: "Mandal",
                email: "test@gmail.com",
                password: "password@123",
            };

            //* creating a new user
            await request(app).post("/users/signup").send(usr).expect(201);
            //* loggin with newly created user
            const response = await request(app)
                .post("/users/login")
                .send({email: usr.email, password: usr.password})
                .expect(200);

            const res = await request(app)
                .post("/users/profile")
                .set("Authorization", "Bearer " + response.body.data.token)
                .set("Content-Type", "application/json")
                .expect(200)
            expect(res.body).toHaveProperty('message', 'User info');
        } catch (error) {}
    });
});
