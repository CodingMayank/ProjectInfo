const jwt = require('jsonwebtoken')

const generatetoken = (user)=>{
  return jwt.sign({_id: user._id,email : user.email, password : user.password,fullname : user.fullname}, "secretKey", { expiresIn: "1h" })
}

module.exports = {
  generatetoken
};