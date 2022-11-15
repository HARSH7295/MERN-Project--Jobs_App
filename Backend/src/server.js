
// loading packages
const express = require('express')
const cors = require('cors')
// loading components
const connectDB = require('../db/connection')
const userRouter = require('../routes/user_routes')
const jobRouter = require('../routes/job_routes')


const app = express()

app.use(express.json())
app.use(cors())

app.use('/api/user',userRouter)
app.use('/api/job',jobRouter)

const port = 8000

const start = async() =>{
    try{
        connectDB('mongodb://127.0.0.1:27017/JOBS_APP_MERN_PROJECT')
        app.listen(port,()=>{
            console.log('Server is running on port : ',port)
        })
    }
    catch(error){
        console.log(error)
    }
}


// checking if server is running or not
app.get('',(req,res)=>{
    res.json({
        'msg':'Hello, server is running here.!!! '
    })
})

start()