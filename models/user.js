const mongoose = require('mongoose')
const passportlocalmongoose = require('passport-local-mongoose');
const passport = require('passport');

const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        reqired:true,
        uniquie:true
    }
})
UserSchema.plugin(passportlocalmongoose);
module.exports = mongoose.model('User',UserSchema);
