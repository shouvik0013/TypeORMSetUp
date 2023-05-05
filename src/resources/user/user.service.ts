import {promisify} from "util";
import {scrypt as _scrypt, randomBytes} from "crypto";
import {appDataSource} from "../../../db/data-source";
import {User} from "./user.entity";
import {SuccessServiceResponse, ErrorServiceResponse} from "../../utils/service-response";

const scrypt = promisify(_scrypt);
const userRepo = appDataSource.getRepository(User);

export const create = async (userInfo: Partial<User>) => {
    try {
        //* CREATING SALT
        const salt = randomBytes(10).toString("hex");

        //* Generating hashed password with salt
        const hash = (await scrypt(userInfo.password, salt, 32)) as Buffer;
        const hashedPassword = salt + "." + hash.toString("hex");

        const user = userRepo.create({
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            email: userInfo.email,
            password: hashedPassword,
        });
        const savedUser = await userRepo.save(user);

        return SuccessServiceResponse(savedUser, "New user saved into db", true);
    } catch (error) {
        return ErrorServiceResponse(error, error.message, false);
    }
};

export const findUserById = async (id: number) => {
    try {
        const user = await userRepo.findOne({
            where: {
                id: id,
            },
        });

        //* IF USER NOT FOUND
        if (!user) {
            //* SEND ERROR RESPONSE WITH NULL VALUE
            return ErrorServiceResponse(null, "User not found", false);
        }
        const {password, ..._user} = user;
        return SuccessServiceResponse(_user, "User found", true);
    } catch (error) {
        return ErrorServiceResponse(error, error.message, false);
    }
};

export const findUserByEmail = async (email: string) => {
    try {
        const user = await userRepo.findOneBy({email: email});

        //* If not found
        if (!user) {
            return ErrorServiceResponse(null, "User with email not found", false);
        }

        
        return SuccessServiceResponse(user, "User found", true);
    } catch (error) {
        return ErrorServiceResponse(error, error.message, false);
    }
};

export const removeById = async (id: number) => {
    try {
        const user = await userRepo.findOneBy({id: id});
        if (!user) {
            const error = new Error("User with given ID not found.");
            return ErrorServiceResponse(error, error.message, false);
        }

        //! DELETING user from database
        const deletionResult = await userRepo.remove(user);
        return SuccessServiceResponse(deletionResult, "user deleted", true);
    } catch (error) {
        return ErrorServiceResponse(error, error.message, false);
    }
};
