import express from 'express'
const router = express.Router()
import passport from 'passport'
import jwt from 'jsonwebtoken'
import config from '../config/database'
import User from '../models/user'

// Register
router.post('/register', (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  })


//if username already exists in teh database return message
  User.getUserByUsername(newUser.email, (err, user) =>{
    if (err) throw err;
    if (user){
      return res.json({success: false, msg:'User already registered'});
    }

      User.addUser(newUser, (err, user) => {
        if(err){
          res.json({success: false, msg:'Failed to register user'});
        } else {
          res.json({success: true, msg:'User registered'});
        }
      })
    })
  })



// Authenticate
router.post('/authenticate', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.getUserByUsername(email, (err, user) => {
    if(err) throw err;
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch){
        const token = jwt.sign(JSON.parse(JSON.stringify(user)) , config.secret, {
          expiresIn: 604800 // 1 week
        });

        res.json({
          success: true,
          token: 'JWT '+token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }
        })
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    })
  })
})

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({user: req.user});
})





export default router
