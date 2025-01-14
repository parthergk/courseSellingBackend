const express = require("express");
const userRouter = express.Router();

userRouter.post('/signup',(req, res)=>{
    const { name, email, password} = req.body;

    
});


userRouter.post('/signin',(req, res)=>{

})


userRouter.post('/purchases',(req, res)=>{

})

module.exports = userRouter;