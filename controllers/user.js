const User=require("../models/user");
const CustomError=require("../helpers/error/CustomError");
const asyncErrorWrapper=require("express-async-handler");


//id'ye
const getSingleUser=asyncErrorWrapper(async(req,res,next)=>{


   return res.status(200).json({
        success:true,
        data:req.data
    });

});

const getAllUsers=asyncErrorWrapper(async(req,res,next)=>{


    return res.status(200).json(res.data);
 
 });

module.exports={getSingleUser,getAllUsers};
