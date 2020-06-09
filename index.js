const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session')
var cors = require('cors')
var sslRedirect = require('heroku-ssl-redirect');

// Import Route
const authRoute = require('./routes/auth');
const sessionRoute = require('./routes/session');

require("dotenv").config();

// // enable ssl redirect
// app.use(sslRedirect());

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// app.use(function(req, res, next) {
//     var allowedOrigins = ['https://app-pair-programming.herokuapp.com', 'https://login-pair-programming.herokuapp.com' , 'https://api-pair-programming.herokuapp.com', 'https://code-pair-programming.herokuapp.com'];
//     var origin = req.headers.origin;
//     if(allowedOrigins.indexOf(origin) > -1){
//          res.setHeader('Access-Control-Allow-Origin', origin);
//     }
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, auth-token");
//     res.header("Access-Control-Allow-Credentials", "true")
//     next();
//   });

//   app.use(session({
//     name: "random_session",
//     secret: "yryGGeugidx34otGDuSF5sD9R8g0Gü3r8",
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         path: "/",
//         secure: true,
//         //domain: ".herokuapp.com", REMOVE THIS HELPED ME (I dont use a domain anymore)
//         httpOnly: true
//     }
// }));

app.use(cors())
app.options('*', cors()) // include before other routes





// Connect to DB
mongoose.connect('mongodb+srv://nachi123:nachi123@cluster0-gf1u7.mongodb.net/test?retryWrites=true&w=majority',
    { useUnifiedTopology: true, useNewUrlParser: true },
    () => console.log('connected to DB')
);


// Route Middlewares
app.use('/user', authRoute);
app.use('/', sessionRoute);



app.listen(process.env.PORT || 3000, () => console.log('server is running on'+process.env.PORT));