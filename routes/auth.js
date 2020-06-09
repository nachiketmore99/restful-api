const router = require('express').Router();

var User = require("../model/User"); 
var Project = require("../model/Project"); 

const customId = require("custom-id");
const { registerValidation, loginValidation } = require('../validation');
const jwt = require('jsonwebtoken');
const url = require('url'); 


// Register
router.post('/register', async (req, res) => {

    const { error } = registerValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message);
    // if (error) return res.render( 'register', {data: {success: false}} );
    console.log(req.body)

    const username = await User.findOne( { username: req.body.username} );
    if (username) return res.status(400).send('Username already exists!');
    // if (username) return res.render( 'register', {data: {success: false}} );

    const emailExist = await User.findOne( { email: req.body.email} );
    if (emailExist) return res.status(400).send('Email already exists!');
    // if (emailExist) return res.render( 'register', {data: {success: false}} );

    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        token: req.body.token
    });
    const custom = customId({
        user,
        randomLenght: 2,
        lowerCase: true
    })

    try{
        const savedUser = await user.save();
        console.log('Registerd Successfully!')
        res.redirect(url.format({
            pathname:'https://login-pair-programming.herokuapp.com/user/login',
            query: {
               "register": true,
             }
          }));
    }
    catch(error){
        res.status(400).send(error);
    }
})

// Login
router.post('/login', async (req, res) => {


    const { error } = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message);
    console.log(req.body)

    const user = await User.findOne( { username: req.body.username} );
    if (!user) return res.status(400).send('Username is not found');

    const validPass = await (req.body.password).localeCompare(user.password);
    if (validPass) return res.status(400).send('Invalid Paswword');

    // Create & assign Token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
    // await User.updateOne(user, {token: token} )
    
    // res.redirect('http://localhost:8080//?token='+token)
    res.cookie('username', req.body.username)
    res.cookie('email', user.email)
    res.cookie('auth_token', token)

    var data = encodeURIComponent(req.body.username+'/'+user.email+'/'+token);
    res.header('Access-Control-Allow-Origin', "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, auth-token");
    res.header("Access-Control-Allow-Credentials", "true")
    res.redirect('https://app-pair-programming.herokuapp.com/?user='+data)

    // res.header('auth-token', token).redirect('http://localhost:8080/');
    console.log('logged in successfully!');

})

// router.post('/project/list', async (req, res) => {
//     console.log(req.body)
//     Project.find({ username: req.body.username }, function(err, projects) {
//             var projectMap = {};
        
//             projects.forEach(function(project) {
//                 projectMap[project._id] = project;
//             });
        
//             res.send(projectMap);  
//         });
    
// })


module.exports = router;