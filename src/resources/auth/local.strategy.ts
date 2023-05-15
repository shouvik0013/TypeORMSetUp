import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";
import {validateAndReturnUser} from "./auth.service";
//* CUSTOM ERRORS
import { InvalidCredentials } from '../../utils/CustomExceptions';

passport.use(
    "local",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async function verify(email: string, password: string, done: Function) {
            console.log('********************CALLED*******************');
            const user = await validateAndReturnUser(email, password);
            console.log('>>>>>>>>>>USER from verify', user);
            if (!user) {
                // const error = new InvalidCredentials("Invalid credentials", 401);
                // throw error;
                return done(null, false);
            }

            return done(null, user);
        }
    )
);

export const LocalAuthGuard = passport.authenticate("local", {session: false, failWithError: true})


export default passport;
