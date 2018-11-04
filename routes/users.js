import express from 'express'
const router = express.Router()
import passport from 'passport'
import jwt from 'jsonwebtoken'
import config from '../config/database'
import User from '../models/user'
import Post from '../models/post'

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
            username: user.username
          }
        })
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    })
  })
})



//post entries

// router.post('/entries', (req, res, next) => {
//   let newPost = new Post({
//     body: req.body.body,
//     date: new Date().toJSON().slice(0,10).replace(/-/g,'/'),
//     tags: req.body.tags,
//   })
//
//
//   User.addEntry(newPost, (err, post) =>{
//     if(err){
//       res.json({success: false, msg:'Failed to add post'});
//     }
//     if (post){
//       console.log(newPost);
//       console.log(this.User);
//       return res.json({success: true, msg:'Post added!'});
//     }
//   })
// })

router.post('/entries', verifyToken, (req, res) => {
  jwt.verify(req.token, 'yoursecret', (err, authData) => {
    if(err) {
      res.sendStatus(403);
    } else {
      let newPost = new Post({
        body: req.body.body,
        date: new Date().toJSON().slice(0,10).replace(/-/g,'/'),
        tags: req.body.tags
      })
      User.addEntry(authData._id, newPost, (err, post) =>{
        if(err){
          res.json({success: false, msg:'Failed to add post'});
        }
        if (post){
          return res.json({success: true, msg:'Post added!'});
        }
      })
    }
  });
});


// router.get('/entries', verifyToken, (req, res) => {
//   jwt.verify(req.token, 'yoursecret', (err, authData) => {
//     if(err) {
//       throw err;
//     } else {
//
//       let posts = Post.getPostById(authData.posts)
// //        res.json({post: posts});
//
//     }
//   });
// });

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({user: req.user});
})


// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }

}




export default router
