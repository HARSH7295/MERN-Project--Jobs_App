const {StatusCodes} = require('http-status-codes')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const authentication = async(req,res,next) =>{
    const authHeader = req.headers.authorization
    
    if(!authHeader.startsWith('Bearer')){
        res.status(StatusCodes.BAD_REQUEST).json({
            'errorMsg':'Invalid Authorization Header.'
        })
    }
    else{
        try{
            const token = authHeader.split(' ')[1]
            const { data : { id : id, email : email, name : name } } = jwt.verify(token,'mysecretkey')
            const user = await User.findOne({
                _id : id
            })
            if(!user){
                res.status(StatusCodes.NOT_FOUND).json({
                    'errorMsg':'Authentication Failed.!!!'
                })
            }
            else{
                req.user = {
                    name : name,
                    email : email,
                    id : id,
            
                }
                next()
            }
        }
        catch(error){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                'errorMsg':'Authentication Failed.!!!'
            })
        }
    }
    
}

module.exports = authentication
