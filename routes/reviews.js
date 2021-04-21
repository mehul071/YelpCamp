const {reviewSchema} = require('../schemas.js');
const express = require('express');
const router = express.Router({mergeParams:true});
const campground = require('../models/campground');
const catchasync = require('../Utils/catchasync');
const Review = require('../models/review')
const expresserror = require('../Utils/ExpressError');


const validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new expresserror(msg,400);
    }
    else
        next();
}

router.post('/',validateReview ,catchasync(async(req,res)=>{
    const campGround = await campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campGround.reviews.push(review);
    await review.save();
    await campGround.save();
    req.flash('success','Successfully created a new campground');
    res.redirect(`/campgrounds/${campGround._id}`);
}));

router.delete('/:reviewid',catchasync(async(req,res)=>{
    const {id,reviewid} = req.params;
    await campground.findByIdAndUpdate(id,{$pull:{reviews: reviewid}});
    await Review.findByIdAndDelete(req.params.reviewid);
    req.flash('success','successfully deleted a new campground');
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;