const express = require('express');
const app = express();
const mongoose = require('./config/mongoose-connection');
const userModel = require('./models/usermodel');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const userRoute = require('./routes/userRoute')
const indexRoute = require('./routes/indexRoute')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const flash = require('connect-flash');
const session = require('express-session');

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use('/images', express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser());
app.use(cors());
app.use(morgan("dev")); 
app.use(session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
  });

app.use("/",indexRoute)
app.use("/user",userRoute)


const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on - http://localhost:${port}`);
});
