const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session')
var cors = require('cors')

// Import Route
const authRoute = require('./routes/auth');
const sessionRoute = require('./routes/session');

require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.options("*",cors())


// Connect to DB
mongoose.connect('mongodb+srv://nachi123:nachi123@cluster0-gf1u7.mongodb.net/test?retryWrites=true&w=majority',
    { useUnifiedTopology: true, useNewUrlParser: true },
    () => console.log('connected to DB')
);


// Route Middlewares
app.use('/user', authRoute);
app.use('/', sessionRoute);

app.listen(process.env.PORT || 5000, () => console.log('server is running'));