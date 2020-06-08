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

// enable ssl redirect
app.use(sslRedirect());

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.options("*",cors())

app.enable('trust proxy'); // optional, not needed for secure cookies
// var routesArray = ['/login', '/auth', '/signup', '/email', '/chPassW', '/logout', '/snapshot'];




// Connect to DB
mongoose.connect('mongodb+srv://nachi123:nachi123@cluster0-gf1u7.mongodb.net/test?retryWrites=true&w=majority',
    { useUnifiedTopology: true, useNewUrlParser: true },
    () => console.log('connected to DB')
);


// Route Middlewares
app.use('/user', authRoute);
app.use('/', sessionRoute);

app.use(['/user', '/user/login'], express.session({
    secret : 'somesecret',
    key : 'sid',
    proxy : true, // add this when behind a reverse proxy, if you need secure cookies
    cookie : {
        secure : true,
        domain:'.herokuapp.com',
        maxAge: 5184000000 // 2 months
    }
}));

app.listen(process.env.PORT || 5000, () => console.log('server is running'));