import passport from "passport";
import {Strategy as JwtStrategy, ExtractJwt} from "passport-jwt";
//* INTERFACES
import {JwtPayload} from '../../interfaces/payload.interface';
//* SERVICES
import {findUserById} from '../user/user.service'

passport.use(
    new JwtStrategy({
        secretOrKey: process.env.JWT_SECRET as string,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        algorithms: ["HS256", "RS256"],
        ignoreExpiration: false,
    }, async function verify(jwt_payload: JwtPayload, done: Function) {
        const userId = jwt_payload.id;
        const userEmail = jwt_payload.email;

        const response = await findUserById(+userId);
        if(!response.success) {
            return done(null, false);
        }
        const user = response.data;
        return done(null, user);
    }), 
);

export default passport;