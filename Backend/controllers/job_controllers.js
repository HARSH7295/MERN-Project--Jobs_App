const Job = require('../models/job')
const User = require('../models/user')
const {StatusCodes} = require('http-status-codes')

const createJob = async(req,res) =>{
    try{        
        req.body.createdBy = req.user.id
        // here, in req.body we have added new field createdBy that have value req.user.userId(the id of current user)
        // by that the Job has ref. to user using userId
        // so its done
        // after that using req.body that contains company, position, createdby (all required fields)
        // we are good to go....
        const job = await Job.create(req.body)
        res.status(StatusCodes.CREATED).json({job})
    }
    catch(error){
        
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            'errorMsg':'Error in creating job'
        })
    }
}

const readAllJobs = async(req,res) =>{
    // NOTE : Keep in mind that we need to send back list of jobs created by current user
    // not the ones created by other users

    const jobs = await Job.find({
        createdBy : req.user.id
    }).sort('createdAt')

    // it will check if job has createdBy same as user.id then ok

    res.status(StatusCodes.OK).json({jobs : jobs, count : jobs.length})
}

const readJob = async(req,res)=>{
    
    const userid = req.user.id
    const jobid = req.params.id

    const job = await Job.findOne({
        _id : jobid,
        createdBy : userid
    })
    if(!job){
        res.status(StatusCodes.NOT_FOUND).json({'errorMsg':`No job with id : ${jobid}`})
    }
    res.status(StatusCodes.OK).json({job:job})

}

const updateJob = async(req,res)=>{
    // updates data in existing job

    // WORK FLOW : 
    // s-1 --> checking if update fields are the fields that our Job model have?
    //              if fields othrer than allowed is added then error
    // s-2 --> if fields are ok then finding by id and userid, if found then ok else error
    // s-3 --> if job found then update it and return

    const userid = req.user.id
    const jobid = req.params.id
    const job = await Job.findOneAndUpdate({
        _id : jobid,
        createdBy : userid
    },
    req.body,
    {
        new : true,
        runValidators : true
    })

    if(!job){
        res.status(StatusCodes.NOT_FOUND).json({'errorMsg':`No job with id : ${jobid}`})
    }
    res.status(StatusCodes.OK).json({job})

}

const deleteJob = async(req,res) =>{
    try{
        const userid = req.user.id
        const jobid =req.params.id
        const job = await Job.findOneAndDelete({
            _id : jobid,
            createdBy : userid
        })
        if(!job){
            res.status(StatusCodes.NOT_FOUND).json({
                'errorMsg':'No job by this id..'
            })
        }
        else{
            res.status(StatusCodes.OK).json({
                'msg':'Job Deleted.!!!!'
            })
        }
    }
    catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            'errorMsg':'Error in deleting job.!!!'
        })
    
    }
}

module.exports = {
    createJob,
    readAllJobs,
    readJob,
    updateJob,
    deleteJob
}