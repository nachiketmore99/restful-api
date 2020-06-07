const router = require('express').Router();
const verify = require('./verifyToken');

var Project = require("../model/Project"); 
var Session = require("../model/Session");
var Member = require("../model/Member"); 
var User = require("../model/User"); 
var Code = require("../model/Code"); 
var customId = require('custom-id')
const { projectValidation, sessionValidation, memberValidation, codeValidation, deleteValidation } = require('../validation');

// verify
router.post('/verify', async (req, res) => {
    console.log('Request verified')
})

// Delete
router.post('/delete', verify, async (req, res) => {

    const { error } = deleteValidation(req.body)
    if (error) return res.status(400).send('error.details[0].message');

    console.log(req.body)
    const memberExists = await User.findOne( { username: req.body.username} );
    if (!memberExists) return res.status(400).send('Member does not exists!');
    // if (username) return res.render( 'register', {data: {success: false}} );

    // const sessionExists = await Session.findOne( { project_name: req.body.project_name} );

    try{
        if(req.body.isSession==true){
            await Session.deleteOne({  session_name: req.body.name });
            console.log('clearing member list for session');
            await Member.deleteMany({ session_name: req.body.name, })
            res.send('Session Deleted')
        }
        else{
            await Project.deleteOne({  project_name: req.body.name });
            res.send('Project Deleted')
        }
    }
    catch(error){
        res.status(400).send(error);
    }
})

// View Project
router.post('/project/list', verify, async (req, res) => {

        Project.find({ username: req.body.username }, function(err, projects) {
                var projectMap = {};
            
                projects.forEach(function(project) {
                    projectMap[project._id] = project;
                });
                console.log(projectMap)
                res.send(projectMap);  
            });
        
    
})

// Create Project
router.post('/project/create', verify, async (req, res) => {
    console.log('creating project')
    
    const { error } = projectValidation(req.body)
    if (error) return res.status(400).send('error.details[0].message');
    
    console.log(req.body)
    
    const projectExists = await Project.findOne( { username: req.body.username, project_name: req.body.project_name} );
    if (projectExists) return res.send(req.body.project_name+' already exists!');

    const project = new Project({
        project_name: req.body.project_name,
        username: req.body.username,
        email: req.body.email
    });

    try{
        await project.save();
        // res.send(savedProject)
        res.send('Project created Successfully!')
    }
    catch(error){
        res.status(400).send(error);
    }
})

// View Sessions
router.post('/session/list', verify, async (req, res) => {

    Session.find({ username: req.body.username }, function(err, sessions) {
            var sessionMap = {};
        
            sessions.forEach(function(session) {
                sessionMap[session._id] = session;
            });
            console.log(sessionMap)
            res.send(sessionMap); 
        });
    
})

// get session_id
router.post('/session/sessionid', verify, async (req, res) => {
    const session = await Session.findOne( { 
        session_name: req.body.session_name,
        username: req.body.username
    } );

    try {
        console.log(session.session_id)
        res.send(session.session_id)
    } catch (error) {
        res.status(400).send(error);
    }
    
})

// Create Session
router.post('/session/create', verify, async (req, res) => {
    console.log('creating session')
    
    const { error } = sessionValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message);
    
    const sessionExists = await Session.findOne( { session_name: req.body.session_name, username: req.body.username } );
    if (sessionExists) return res.send(req.body.session_name+' already exists!');
    
        let sessionId = customId({
            session_name: req.body.session_name,
            randomLength: 2,
        })
    
        const session = new Session({
            session_name: req.body.session_name,
            username: req.body.username,
            email: req.body.email,
            session_id: sessionId
        });
    
        try{
            await session.save();
            res.send('Session created Successfully!');
        }
        catch(error){
            res.status(400).send(error);
        }
})

// Deleting all sessions
router.post('/session/clear', verify, async (req, res) => {
    console.log('deleting session')
    
    try{
        await Session.deleteMany({
            username: req.body.username,
        })
        res.send('Sessions Cleared for '+ req.body.username)
    }
    catch(error){
        res.status(400).send(error);
    }
})




// View Members
router.post('/member/list', verify, async (req, res) => {

    Member.find({ admin: req.body.admin, session_name: req.body.session_name }, function(err, members) {
            var memberMap = {};
        
            members.forEach(function(member) {
                memberMap[member._id] = member;
            });
            res.send(memberMap);  
        });
    
})

// View Joined Sessions
router.post('/session/joined', verify, async (req, res) => {

    Member.find({ username: req.body.username }, function(err, session) {
            var sessionMap = {};
        
            session.forEach(function(session) {
                sessionMap[session._id] = session;
            });
        
            res.send(sessionMap);  
        });
    
})

// Exit from Sessions
router.post('/session/exit', verify, async (req, res) => {

    console.log('exiting session ', req.body.session_name)

    const memberExists = await User.findOne( { username: req.body.username} );
    if (!memberExists) return res.status(400).send('Member does not exists!');
    // if (username) return res.render( 'register', {data: {success: false}} );

    try{
        await Member.deleteOne({  username: req.body.username, session_name: req.body.session_name });
        res.send(req.body.username+' Removed from session');
    }
    catch(error){
        res.status(400).send(error);
    }
    
})

// Add Member
router.post('/member/add', verify, async (req, res) => {
    console.log('adding member')
    
    const { error } = memberValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message);
    
    console.log(req.body)

    const sessionExists = await Member.findOne( { username: req.body.username ,session_name: req.body.session_name, } );
    if (sessionExists) return res.status(400).send('Session already joined!');

    const session = await Session.findOne({ session_id: req.body.session_id });
    const admin = session.username;
    if(admin!=req.body.username){
            
            const session_name = session.session_name;
            

            const member = new Member({
                username: req.body.username,
                email: req.body.email,
                session_id: req.body.session_id,
                session_name: session_name,
                admin: admin
            });

            try{
                const savedMember = await member.save();
                res.send('Session Joined Successfully!')
            }
            catch(error){
                res.status(400).send(error);
            }
    }
    else{ res.send('Admin cannot Join its own session') }
})

// Remove Member from session
router.post('/member/remove', verify, async (req, res) => {
    console.log('removing member')
    
    console.log(req.body)

    const memberExists = await User.findOne( { username: req.body.username} );
    if (!memberExists) return res.status(400).send('Member does not exists!');
    // if (username) return res.render( 'register', {data: {success: false}} );

    try{
        await Member.deleteOne({  username: req.body.username });
        res.send(req.body.username+' Removed from session');
    }
    catch(error){
        res.status(400).send(error);
    }
})

// save code in DB
router.post('/code/save', verify, async (req, res) => {
    console.log(req.body)
    const { error } = codeValidation(req.body)
    if (error) {
        if(req.body.code!=''){ 
            return res.status(400).send(error.details[0].message);
        }
        else{ console.log('code is empty') }
    }
    

    const codeExists = await Code.findOne( { project_name: req.body.project_name} );
    if (!codeExists){
        try {
            const code = new Code({
                project_name: req.body.project_name,
                code: req.body.code,
                username: req.body.username,
                email: req.body.email
            });
    
            await code.save();
            res.send('Code Saved Successfully')  

        } catch (error) {
            res.status(400).send(error);
        }
    }else{
        try{
            await Code.updateOne(
                { "username": req.body.username}, // Filter
                {"code": req.body.code} // Update
            )
            res.send('Code Updated Successfully!')
        }
        catch(error){
            res.status(400).send(error);
        }
    }
    
})
// get code from DB
router.post('/code/get', verify, async (req, res) => {

    const code = await Code.findOne( { 
        project_name: req.body.project_name,
        username: req.body.username
    } );
    console.log(code)
    try{
        res.send(code.code)
    }
    catch(error){
        res.status(400).send(error);
    }
    
})

router.post('/exists', verify, async (req, res) => {
    try {
        var exists = Member.findOne({ username: req.body.username, session_name: req.body.session_name })
        if(exists){
            res.send(true)
        }
        else{ res.send(false) }
    } catch (error) {
        res.status(400).send(error);
    }
})


module.exports = router;
