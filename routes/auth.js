const { Router } = require('express');
const router = Router();
const Users = require('../data/schema/Users');
const { hashPassword, comparePassword } = require('../utils/bcrypt')
const fs = require('fs');
const session = require('express-session');

// Data
const data = fs.readFileSync('./data/users.json', 'utf8');
const usersdata = JSON.parse(data);

router.use(session())

router.post('/signup', async (req, res) =>{
    const { username, password, email } = req.body;
    console.log(username);
    console.log('zzzz');
    
    const userDB = await Users.findOne({ $or: [{ username }, { email } ] })
    console.log(userDB , "<========");
    if(userDB){
        res.status(400).send({
            msg: "User already exists!"
        })
    } else {
        const password = hashPassword(req.body.password);
        const newuser = await Users.create({username, password, email});
        newuser.save()
        req.session.user = {username, password, email};
        res.status(201).send({
            msg: "User created successfully"
        })
    }
})

router.post('/login', async (req, res) =>{
    const { email, password } = req.body;
    if(!email || !password) return res.status(400);
    const user = await Users.findOne({ email });
    if(!user) return res.send({ msg: "Email not found!" });
    const isValid = comparePassword(req.body.password, user.password);
    if(isValid) {
        req.session.user = user;
        res.send({ msg: "You Are User"})
    }
    else res.status(401); 
})

module.exports = router;