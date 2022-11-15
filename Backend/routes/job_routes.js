const express = require('express')

const router = express.Router()

const authentication = require('../middleware/authentication')

const {createJob,readAllJobs,readJob,updateJob,deleteJob} = require('../controllers/job_controllers')

router.route('/createJob').post(authentication,createJob)
router.route('/readAllJobs').get(authentication,readAllJobs)
router.route('/readJob/:id').get(authentication,readJob)
router.route('/deleteJob/:id').delete(authentication,deleteJob)
router.route('/updateJob/:id').patch(authentication,updateJob)

module.exports = router
