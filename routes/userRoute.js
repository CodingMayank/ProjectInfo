const express = require('express');
const router = express.Router();
const apiloader = require('../middlewares/apiloader')
const {createUser, loginUser, updateProfile, uploadprofilepic} = require('../controllers/authcontroller');
const upload = require('../config/multer-config');
const profileModel = require("../models/profilemodel")
const userModel = require("../models/usermodel");
const verifyToken = require('../middlewares/isloggedin');


router.post("/create",apiloader,createUser)
router.post("/login",apiloader,loginUser)
router.post("/update/profile",apiloader,verifyToken,updateProfile)
router.post("/profile/picture",apiloader,verifyToken,upload.single("profilepic"),uploadprofilepic)




module.exports = router;