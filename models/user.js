import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import config from '../config/database'
import Post from './post'

const UserSchema = mongoose.Schema ({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  posts: [{
    body: {
      type: String
    },
    date: {
      type: Date,
      required: true
    },
    tags: {
      type: [String]
    }
  }]
})

const User = module.exports = mongoose.model('User', UserSchema);



module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}

module.exports.getUserByUsername = function(email, callback){
  const query = {email: email}
  User.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback){
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

 module.exports.addEntry = function (id, newPost, callback){
   User.findByIdAndUpdate(
        id,
        {$push: {posts: newPost}},
        {safe: true, upsert: true, new : true},
        callback);

 }



 // module.exports.getPosts = function (id, callback){
 //   const query = {_id: id}
 //   let user = User.findOne(query, callback);
 //
 // }

module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  });
}
