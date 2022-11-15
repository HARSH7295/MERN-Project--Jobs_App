const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = mongoose.Schema({
    name:{
        type : String,
        required : [true,'Please provide name field.!!'],
        min : [3,'Please provide name having length greater than 3'],
        max : [20,'Please provide name having length less than 20']
    },
    email : {
        type : String,
        required : [true,'Please provide email field.!!'],
        unique : true,
        validate : function(value){
            if(!validator.isEmail(value)){
                throw Error('Please provide correct email address.!')
            }
        }
    },
    password : {
        type : String,
        required : [true,'Please provide password field.!!'],
        min : [5,'Please provide password of length greater than 4..!!']
    }
})

const User = mongoose.model('User',userSchema)

module.exports = User