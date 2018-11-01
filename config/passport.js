var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
import User from '../models/user'
import config from '../config/database'

 module.exports = function(passport){
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt')
  opts.secretOrKey = config.secret;
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
      User.getUserById(jwt_payload._id, (err, user) => {
        if(err){
          return done(err, false);
        }

        if(user){
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
  }))
}
