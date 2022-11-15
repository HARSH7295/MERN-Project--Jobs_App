const {StatusCodes} = require('http-status-codes')
const bcrypt = require('bcryptjs')
const User  = require('../models/user')
const jwt = require('jsonwebtoken')
var CryptoJS = require("crypto-js");

const registerUser = async(req,res) =>{
    const { name, email, password } = req.body
    if(!name || !email || !password){
        res.status(StatusCodes.BAD_REQUEST).json({
            'errorMsg':'Please provide all fields..'
        })
    }
    else{
        const user = await User.findOne({
            email : email
        })
        if(user){
            res.status(StatusCodes.NOT_ACCEPTABLE).json({
                'errorMsg':'Email is already used.Try different one.!!!'
            })
        }
        else{
            try{
                
                const cipherText = CryptoJS.AES.encrypt(password,'mysecretkey65197295').toString()
    
                const user = await User.create({
                    name : name,
                    email : email,
                    password : cipherText
                })
                const token = jwt.sign({
                    data : {
                        id : user._id,
                        name : user.name,
                        email : user.email
                    }},'mysecretkey')
                res.status(StatusCodes.CREATED).json({
                    Msg:'User Created successfully.!!',
                    user:{
                        name : user.name,
                        id : user._id,
                        email : user.email
                    },
                    token : token
                })
            }
            catch(error){
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    'errorMsg':'Error in generating hashed password.!!!'
                })
            }
        }
    }
}

const loginUser = async(req,res)=>{
    const { email, password } = req.body
    if( !email || !password){
        res.status(StatusCodes.BAD_REQUEST).json({
            'errorMsg':'Please provide all fields..'
        })
    }
    else{
        const user = await User.findOne({
            email : email
        })
        if(!user){
            res.status(StatusCodes.NOT_FOUND).json({
                'errorMsg':'No user by provided email..Please try again..!!!'
            })
        }
        else{
            try{
                var bytes  = CryptoJS.AES.decrypt(user.password, 'mysecretkey65197295');
                var originalText = bytes.toString(CryptoJS.enc.Utf8);
                if(!(originalText === password)){
                    res.status(StatusCodes.UNAUTHORIZED).json({
                        'errorMsg':'Invalid Credentials!!!'
                    })
                }
                else{
                    try{
                        const token = jwt.sign({
                            data : {
                                id : user._id,
                                name : user.name,
                                email : user.email
                            }},'mysecretkey')
                        res.status(StatusCodes.OK).json({
                                msg : 'Login successful.!!',
                                user:{
                                    name : user.name,
                                    id : user._id,
                                    email : user.email
                                },
                                token : token
                            })
                    }
                    catch(error){
                        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                            'errorMsg':'Error in loging in.!!!'
                        })
                    }
                    
                }
            }
            catch(error){
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    'errorMsg':'Error in loging in.!!!'
                })
            }
        }
    }
}

const logoutUser = async(req,res)=>{
    res.status(StatusCodes.OK).json({
        msg : 'Logout successful.!!!'
    })
}

const getAllUsers = async(req,res) =>{

}

const getProfile = async(req,res) =>{
    try{
        const user = await User.findOne({
            email : req.user.email
        })
        // Decrypt
        var bytes  = CryptoJS.AES.decrypt(user.password, 'mysecretkey65197295');
        var originalText = bytes.toString(CryptoJS.enc.Utf8);
        res.status(StatusCodes.OK).json({
            user : {
                email : user.email,
                password : originalText
            }
        })
    }
    catch(error){
        console.log(error)
    }

}

const updateUserDetails = async(req,res) =>{
    const {email,password} = req.body
    if(!email || !password){
        res.status(StatusCodes.FORBIDDEN).json({
            'errorMsg':'Please provide valid email and password.!!!'
        })
    }
    else{
        try{    
            const user = await User.findOne({
                email : req.user.email
            })

            user.email = email
            const cipherText = CryptoJS.AES.encrypt(password,'mysecretkey65197295').toString()
            user.password = cipherText
            user.save()
            const token = jwt.sign({
                data : {
                    id : user._id,
                    name : user.name,
                    email : user.email
                }},'mysecretkey')
            
            var bytes  = CryptoJS.AES.decrypt(user.password, 'mysecretkey65197295');
            var originalText = bytes.toString(CryptoJS.enc.Utf8);
            
            res.status(StatusCodes.OK).json({
                user : {
                    email : user.email,
                    password : originalText
                },
                token : token
            })
        }
        catch(error){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                'errorMsg':'Some error occured during updating.!!!'
            })
        }

    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getAllUsers,
    getProfile,
    updateUserDetails
}