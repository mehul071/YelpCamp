const { required} = require('joi');
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    image: String,
    description: String,
    location: String,
    reviews:
    [
        {
            type: Schema.Types.ObjectId,
            ref:'review',
            required: true
        }
    ]
});

module.exports = mongoose.model('Campground',CampgroundSchema);