const express = require('express')

const router = express.Router()
const authentication = require('../middleware/authentication')
const authorization = require('../middleware/authorization')

const {registerUser,loginUser,logoutUser,getAllUsers,getProfile,updateUserDetails} = require('../controllers/user_controllers')

router.route('/registerUser').post(registerUser)
router.route('/loginUser').post(loginUser)
router.route('/logoutUser').get(authentication,logoutUser)
router.route('/getAllUsers').get(authentication,authorization('admin'),getAllUsers)

router.route('/getProfile').get(authentication,getProfile)
router.route('/updateUserDetails').patch(authentication,updateUserDetails)

module.exports = router
