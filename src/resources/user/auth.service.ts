import {scrypt as _scrypt, randomBytes} from "crypto";
import {promisify} from "util";
import {User} from "./user.entity";
import {SuccessServiceResponse, ErrorServiceResponse} from "../../utils/service-response";
import {findUserByEmail, findUserById} from "./user.service";
//* INTERFACES
import {JwtPayload} from '../../interfaces/payload.interface';
import * as jwt from "jsonwebtoken";

const scrypt = promisify(_scrypt);

export async function validateUser(email: string, password: string) {
    try {
        console.log(">>>>>>>>>>>>>validateUser function");
        const response = await findUserByEmail(email);

        if (!response.success) {
            return null;
        }

        const user: User = response.data;
        console.log(">>>>>>>>>>>>>USER IN auth.service", user);

        const [storedSalt, storedHash] = user.password.split(".");
        const hash = (await scrypt(password, storedSalt, 32)) as Buffer;

        const isMatched = storedHash === hash.toString("hex");
        console.log(">>>>>>>>>>> Password Matched:", isMatched);
        if (!isMatched) {
            return null;
        }

        const {id, email: userEmail} = user;
        return {id, email: userEmail};
    } catch (error) {
        return null;
    }
}

export const login = async (user: {id: number; email: string}) => {
    try {
        const payload: JwtPayload = {id: user.id, email: user.email};
        const token = jwt.sign(payload, process.env.JWT_SECRET, {algorithm: "HS256"});
        return SuccessServiceResponse(token, "Token generated", true);
    } catch (error) {
        console.log('>>>>>>>>>>>>>>>TOKEN GENERATION FAILED', error);
        console.log('\n\nEND OF ERROR');
        return ErrorServiceResponse(null, "Token could not be generated", false);
    }
};
