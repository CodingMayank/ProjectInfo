const express = require('express');
const bcrypt = require('bcrypt')
const userModel = require('../models/usermodel')
const {generatetoken} = require("../utils/generatetoken")
const jwt = require('jsonwebtoken');
const profileModel = require("../models/profilemodel");
const upload = require('../config/multer-config');
const fs = require('fs')
const path = require("path")

const createUser = async (req, res) => {
  try {
      let { fullname, username, email, password, age, phoneNumber } = req.body;
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phoneNumber)) {
          return res.status(400).json({ message: "Phone number must be exactly 10 digits and contain only numbers." });
      }

      
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ message: "User already exists", loading: req.loading });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

     
      const newUser = await userModel.create({
          fullname,
          username,
          phoneNumber,
          age,
          email,
          password: hashedPassword,
      });

      res.status(201).json({
          message: "User created successfully",
          loading: req.loading,
          user: {
              id: newUser._id,
              fullname: newUser.fullname,
              username: newUser.username,
              email: newUser.email,
              age : newUser.age,
              phoneNumber : newUser.phoneNumber,
          },
      });
  } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Something went wrong", loading: req.loading });
  }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found", error: true });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials", error: true });
      }
  
      const token = generatetoken(user);
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });
  
      res.status(200).json({ message: "Login successful", success: true, user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        age : user.age,
        username : user.username,
        phonenumber : user.phonenumber,

      } });
    } catch (err) {
      console.error("Error during login:", err);
      res.status(500).json({ message: "Internal server error", error: true });
    }
  };

const updateProfile = async (req, res) => {
    try {
      const userId = req.user._id;
      const fullname = req.user.fullname;
      const { skill01, desc01, skill02, desc02, skill03, desc03, bio } = req.body;
  
      // Check if a profile already exists
      const existingProfile = await profileModel.findOne({ user: userId });
  
      if (existingProfile) {
        // Update the existing profile
        await profileModel.findByIdAndUpdate(existingProfile._id, {
          skill01,
          desc01,
          skill02,
          desc02,
          skill03,
          desc03,
          bio
        });
  
        res.redirect(`/user/profile/${userId}/${fullname}`);
      } else {
        // Create a new profile and link to user
        const newProfile = await profileModel.create({
          skill01,
          desc01,
          skill02,
          desc02,
          skill03,
          desc03,
          bio,
          user: [userId]
        });
  
        await userModel.findByIdAndUpdate(
          userId,
          { $push: { profile: newProfile._id } },
          { new: true }
        );
  
        res.redirect(`/user/profile/${userId}/${fullname}`);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error while updating profile' });
    }
  };

const uploadprofilepic = async (req, res) => {
    try {
      const user = await userModel.findOne({ email: req.user.email });
      if (!user) return res.status(404).send("User not found");

      if (user.profilepic && user.profilepic !== "default.avif") {
        const oldPicPath = path.join(__dirname, "../public/images", user.profilepic);
        if (fs.existsSync(oldPicPath)) {
          fs.unlinkSync(oldPicPath); // deletes the old image
        }
      }
  
      if (req.file) {
        user.profilepic = req.file.filename;
        await user.save();
      }
  
      res.redirect(`/user/profile/${user._id}/${user.fullname}`);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error uploading profile picture");
    }
  };
   

    





module.exports = {
    createUser,
    loginUser,
    updateProfile,
    uploadprofilepic
}