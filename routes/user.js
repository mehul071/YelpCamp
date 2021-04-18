const express = require('express');
const router = express.Router();
const User = require('../models/user');
const app = express();

router.get('/register',(req,res)=>{
    res.render('user/register');
});

router.post('/register',async (req,res)=>{
    const {email,username,password} = req.body;
    const user = new User({email,username});
    const regsistredUser = await User.register(user,password);
    console.log(regsistredUser);
    // req.flash('message', 'Success!!');
    res.redirect('/campgrounds');
})

module.exports = router;
