import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';
import User from '../src/models/user';
const keys = process.env.SECRET_KEY;
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys;

export default passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        User.findById(jwt_payload.id)
        .then(user => {
            if(user){
                return done(null, user);
            }
            else{
                return done(null, false);
            }
        })
        .catch(err => console.log(err));
    }));
};