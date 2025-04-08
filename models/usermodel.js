const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  fullname : {
    type : String,
    required : true,
  },
  username : {
    type : String,
    required : true,
    unique : true,
  },
  email : {
    type : String,
    required : true,
    unique : true,
  },
  password : {
    type : String,
    required : true,
  },
  age:{
    type : Number,
  },
  phoneNumber : {
    type : Number,
    required : true,
    unique : true,
  },
  profilepic : {
    type : String,
    default : "default.avif",
  },
  profile : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref : "profile",
    }
  ]
})

module.exports = mongoose.model("user",userSchema)