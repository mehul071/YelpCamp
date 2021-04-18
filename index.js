const {captureRejectionSymbol} = require('events');
const express = require('express');
const mongoose = require('mongoose');
const ejsmate = require('ejs-mate');
const expresserror = require('./Utils/ExpressError');
const catchasync = require('./Utils/catchasync');
const methodoverride = require('method-override');
const review = require('./models/review')
const campground = require('./models/campground');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const Userroutes = require('./routes/user');
const session = require('express-session');
const flash = require('connect-flash');
const campgroundroutes = require('./routes/campgrounds');
const reviewroutes = require('./routes/reviews')
const {campgroundSchema ,reviewSchema} = require('./schemas.js');
const app = express();

mongoose.connect('mongodb://localhost:27017/Yelp-camp',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error",console.error.bind(console, "connection error:"));
db.once("open",()=>{
    console.log("Database Connected");
});


const path = require('path');

app.engine('ejs',ejsmate);

app.use(express.urlencoded({extended: true}));
app.use(methodoverride('_method'));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use('/',Userroutes);

app.use(flash());
app.use('/campgrounds',campgroundroutes);
app.use('/campgrounds/:id/reviews',reviewroutes);

const validatecampground = (req,res,next)=>
{
    const {error} = campgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el =>el.message).join(',')
        throw new expresserror(msg,400)
    }
    else
        next();
}

app.get('/',(req,res)=>{
    res.send('Hello From YelpCamp');
});

app.get('/auth',async(req,res)=>{
    const user = new User({email:'mehultyagi01@gmail.com',username:'mehultyagi'});
    const newuser = await User.register(user,'chicken');
    res.send(newuser);
})

app.put('/campgrounds/:id',validatecampground,catchasync(async(req,res)=>{        //editting the form
    const { id } = req.params;
    const campgroundid = await campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${campgroundid._id}`);
}));

app.get('/campgrounds/:id/edit',catchasync(async(req,res)=>{
    const campgroundid = await campground.findById(req.params.id);
    res.render('campground/edit',{campgroundid });
}));

app.all('*',(req,res,next)=>{
    next(new expresserror('page not found',404))
});

app.use((err,req,res,next) => {
    const {statuscode = 500} = err;
    if(!err.message) err.message = 'OH here comes an error';
    res.status(statuscode).render('error',{err});
});

app.listen(3001,()=>{
    console.log('Listening on port 3001');
});