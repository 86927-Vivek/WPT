const express=require('express')
const cors=require('cors') //allows your server to accept requests from diffrent origins (e.g diffrent domains or ports)

//used for generating and verifying 
//tokens for authentication and authorization purposes
const jwt=require('jsonwebtoken')

//this line imports a configuration file (config.js)
const config=require('./config')

//this line imports a utility file (utils.js)
//from the same directory which likely contains 
//reusable functions and helpers for your application
const utils=require('./utils')

//this line creates a new instance of the Express.js application 
//which is the main entry point for your server.
const app = express()

//This line enables CORS middleware for your application
app.use(cors())

//This line enables JSON parsing for incoming requests.
//This middleware parses incoming requests with JSON payloads
//and makes the data available in the req.body object.

//By using app.use(express.json()), your'e telling Express.js
//to parse JSON data sent in the request body
//This is useful when working 
app.use(express.json())

//middleware to verify the token
app.use((request, response, next) => {
    //check if token is required for the api
    if(
        request.url === "/user/login" ||
        request.url === "/user/register"||
        request.url.startsWith('/image/')){
            //skip verifying token
            next()
        }        
    else {
        // console.log("login successful");
        //get the token 
        const authtoken = request.headers.authorization;
        const token = authtoken.split(' ')[1];
        console.log("$ ", token);
        //if token does not exist or token length is zero
        if(!token || token.length === 0){
            response.send(utils.createErrorResult('missing token'))
        }else{
            try{
                //verify the token
                const payload = jwt.verify(token, config.secret)

                //add the user Id to the request 
                request.userId = payload['id']

                //expiry logic

                //call the real route
                next()
            }catch(ex){
                response.send(utils.createErrorResult('invalid token'))
            }
        }
    }


})



const userRouter = require('./routes/user')
const categoryRouter = require('./routes/category')
const propertyRouter = require('./routes/property')
const bookingRouter = require('./routes/booking')
//const imageRouter = require('./routes/image')

app.use('/user',userRouter)
app.use('/category', categoryRouter)
app.use('/property',propertyRouter)
app.use('/booking',bookingRouter)
//app.use('/image', imageRouter)


app.listen(4000,'0.0.0.0',()=>{
    console.log(`server started at port 4000`)
})


