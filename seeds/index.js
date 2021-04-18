const mongoose = require('mongoose');
const cities = require('./cities')
const {places, descriptors} = require('./helper')
const campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/Yelp-camp', {useNewUrlParser: true,useCreateIndex: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on("error",console.error.bind(console, "connection error:"));
db.once("open",()=>{
    console.log("Database Connected");
});

const sample = array => array[Math.floor(Math.random() * array.length )];

const seedDB = async()=>
{
    await campground.deleteMany({});
    for(let i=0;i<50;i++)
    {
        const random1 = Math.floor(Math.random() *100);
        const price = Math.floor(Math.random() * 40) +10;
        const camp = new campground
        ({
            location:`${cities[random1].city}, ${cities[random1].state}`,
            title : `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/429524',
            description: 'Hello my name is mehul tyagi and i am working on YelpCamp project from the last one week and it has been amazing',
            price
        })
        await camp.save();
    }  
}
seedDB().then(()=> {
    mongoose.connection.close();

})