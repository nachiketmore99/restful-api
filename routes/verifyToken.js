const jwt = require('jsonwebtoken');
var User = require("../model/User"); 

module.exports = async function auth(req, res, next){
    // console.log(req.body)
    // try {
    //     const user = await User.findOne( { username: req.body.username} );
    //     if(user.token==""){
    //         res.send('You need to login')
    //     }
    //     console.log('user verified')
    //     next();
    // } catch (error) {
    //     res.send(error)
    // }



    const token = req.header('auth-token')
    console.log('verifying')
    if(!token) return res.status(401)

    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verified
        console.log('user verified')
        next();
        
    }catch(err){
        res.redirect('https://login-pair-programming.herokuapp.com/user/login')
    }
}