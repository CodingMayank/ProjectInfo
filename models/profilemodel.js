const mongoose = require('mongoose')

const profileSchema = mongoose.Schema({
  skill01 : {
    type : String,
    required : true,
  },
  desc01 : {
    type : String,
    required : true,
  },
  skill02 : {
    type : String,
    required : true,
  },
  desc02 : {
    type : String,
    required : true,
  },
  skill03 : {
    type : String,
    required : true,
  },
  desc03 : {
    type : String,
    required : true,
  },
  bio : {
    type : String,
  },
  user : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref : "user",
    }
  ]
})

module.exports = mongoose.model("profile",profileSchema)