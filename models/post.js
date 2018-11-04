import mongoose from 'mongoose'
import User from './user'


const PostSchema = mongoose.Schema ({
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

})

const Post = module.exports = mongoose.model('Post', PostSchema);



module.exports.getPostById = function(id){
  let posts = [];
  for(let i in id){

    posts.push(Post.findById(id[i]));
  }
  console.log(posts);
  return posts;
}
