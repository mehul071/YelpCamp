const express = require('express');
const router = express.Router();
const expresserror = require('../Utils/ExpressError');
const catchasync = require('../Utils/catchasync');
const Campground = require('../models/campground');
const {campgroundSchema} = require('../schemas.js');
const reviews = require('../models/review')



const validatecampground = (req,res,next)=>
{
    const {error} = campgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el =>el.message).join(',')
        throw new expresserror(msg,400)
    }
    else{
        next();
    }
}

router.get('/new',(req,res)=>{         //adding a new entry
    res.render('campground/new');
});

router.post('/',validatecampground,catchasync(async(req,res,next)=>{
    const campgroundnew = new Campground(req.body.campground);
    await campgroundnew.save();
    req.flash('success','this was successfully shown');
    res.redirect(`/campgrounds/${campgroundnew._id }`);
}));


router.get('/:id',catchasync(async(req,res)=>{
    const campgroundid = await Campground.findById(req.params.id).populate('reviews');
    if(!campgroundid){
        req.flash('error','Cannot find the campground');
        return res.redirect('/campgrounds');
    }
    res.render('campground/show',{campgroundid});
}));

router.get('/',async(req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campground/index',{campgrounds});
});

router.delete('/:id',catchasync(async(req,res)=>{
    const { id } = req.params;
    const deleteobj = await Campground.findByIdAndDelete(id);
    req.flash('success','successfully deleted a Campground');
    res.redirect('/campgrounds');
}));

module.exports = router;