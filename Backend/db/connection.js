
const mongoose = require('mongoose')

const connectDB = async(url) =>{
    return mongoose.connect(url,{
        useNewUrlParser : true,
    })
}

module.exports = connectDB