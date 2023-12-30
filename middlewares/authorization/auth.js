const CustomError=require("../../helpers/error/CustomError");
const User = require("../../models/user");
const Question=require("../../models/question");
const Answer=require("../../models/answer");
const jwt=require("jsonwebtoken");
const asyncErrorWrapper=require("express-async-handler");
const {isTokenIncluded,getAccessTokenFromHeader}=require("../../helpers/authorization/tokenHelpers");
const getAccessToRoute=(req,res,next)=>{

    const {JWT_SECRET_KEY}=process.env;

    //Token Control
    //401: Unauthorized
    //403: Forbidden

    if(!isTokenIncluded(req))//Kullanıcı yanlış bir formatta veya tokensız göndermişse
    {
        return next(new CustomError("You are not authorized to access this route",401));
    }

    const access_token=getAccessTokenFromHeader(req); 

    jwt.verify(access_token,JWT_SECRET_KEY,(err,decoded)=>{

        if(err)
        {
            return next(new CustomError("You are not authorized to access this route",401));
        }

       req.user={
        id:decoded.id,
        name:decoded.name
       };

        next();

    });
};

const getAdminAccess=asyncErrorWrapper(async(req,res,next)=>
{

    const {id}=req.user;
    const user= await User.findById(id);

    if(user.role !== "admin")
    {
        return next(new CustomError("Only administrators can access the system",403));
    }

    next();

});

const questionOwnerAccess=asyncErrorWrapper(async(req,res,next)=>{

    const userId=req.user.id;
    const questionId=req.params.id;

    const question= await Question.findById(questionId);

    if(question.user!=userId)
    {
    return next(new CustomError("Only owner can handle this operation",403));
    }

    next();

});

const answerOwnerAccess=asyncErrorWrapper(async(req,res,next)=>{

   const userId=req.user.id;
   const {answer_id}=req.params;

   const answer= await Answer.findById(answer_id);

    if(answer.user!=userId)
    {
        return next(new CustomError("Only owner can handle this operation",403));
    }

    next();
});


module.exports={getAccessToRoute,getAdminAccess,questionOwnerAccess,answerOwnerAccess};