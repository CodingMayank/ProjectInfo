const express = require('express');
const usermodel = require('../models/usermodel');
const verifyToken = require('../middlewares/isloggedin');
const loggedout = require('../middlewares/isloggedout');
const { route } = require('./userRoute');
const router = express.Router();
const homeinfo = require("../middlewares/homeinfo");
const userinfo = require('../middlewares/userinfo');
const upload = require("../config/multer-config")
const profilemodel = require("../models/profilemodel")



router.get("/logout",loggedout)

router.get('/', (req, res) => {
  res.render("home", homeinfo);
  res.clearCookie('token'); 
});

router.get("/user/profile/:id/:fullname", verifyToken, async (req, res) => {
  try {
    const user = await usermodel.findOne({
      _id: req.params.id,
      fullname: req.params.fullname
    }).populate('profile');

    if (!user) return res.status(404).send("User not found");

    const profile = user.profile[0]; // assuming only one profile per user

    const details = {
      ...userinfo,
      user: {
        id : user._id,
        name: user.fullname,
        bio: profile?.bio || "No bio available.",
        profilepic: user.profilepic || "/images/default.avif"
      },
      services: profile
        ? [
            { title: profile.skill01, description: profile.desc01 },
            { title: profile.skill02, description: profile.desc02 },
            { title: profile.skill03, description: profile.desc03 }
          ]
        : []
    };

    res.render("userProfile", { userinfo: details });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.get("/user/create",(req,res)=>{
  res.render("createUser")
})

router.get("/user/login",async (req,res)=>{
  res.render("loginUser")
})

router.get("/services/:id/:fullname",verifyToken,async (req,res)=>{
  let user = await usermodel.findOne({_id:req.params.id,fullname:req.params.fullname})
  res.render("services",{user})
})

router.get("/about/:id/:fullname",verifyToken,async (req,res)=>{
  let user = await usermodel.findOne({_id:req.params.id,fullname:req.params.fullname})
  res.render("about",{user})
})

router.get("/contact",verifyToken,(req,res)=>{
  res.render("contact")
})

router.get("/user/update/profile/:id/:fullname",verifyToken, async (req,res)=>{
  let user = await usermodel.findOne({_id:req.params.id,fullname:req.params.fullname})
  res.render("updateprofile",{user})
})

router.get("/user/update/profilepicture/:id/:fullname",verifyToken, async (req,res)=>{
  let user = await usermodel.findOne({_id:req.params.id,fullname:req.params.fullname})
  res.render("profilepic",{user})
})


module.exports = router;