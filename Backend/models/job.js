const monggoose = require('mongoose')

const jobSchema = monggoose.Schema({
    position : {
        type : String,
        required : [true,'Please provide position field.!!'],
    },
    company : {
        type : String,
        required : [true,'Please provide company field.!!'],
    },
    location : {
        type : String,
        required : [true,'Please provide location field.!!'],
    },
    status : {
        type : String,
        required : [true,'Please provide status field.!!'],
        enum : ['pending','interview','declined'],
        default : 'pending'
    },
    jobtype : {
        type : String,
        required : [true,'Please provide position field.!!'],
        enum : ['fulltime','parttime','remote','internship'],
        default : 'fulltime'
    },
    createdBy : {
        type : monggoose.Types.ObjectId,
        ref : 'User',
        required : true
    }
},{
    timestamps : true
})

const Job = monggoose.model('Job',jobSchema)

module.exports = Job