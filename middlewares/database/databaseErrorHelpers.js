const User=require("../../models/user");
const Question=require("../../models/question");
const Answer=require("../../models/answer");
const CustomError=require("../../helpers/error/CustomError");
const asyncErrorWrapper=require("express-async-handler");

const checkUserExits=asyncErrorWrapper(async(req,res,next)=>{

    const {id}=req.params;
    const user = await User.findById(id);

    if(!user)
    {
        return next(new CustomError("There is no such user with that id",400));
    }


    req.data=user; //Veritabanı uzun olan projelerde 2 kere id'yi çekme işlemi gerçekleştirmesin diye.

    next();

});

const checkQuestionExits=asyncErrorWrapper(async(req,res,next)=>{

    const question_id=req.params.id || req.params.question_id;
    const question=await Question.findById(question_id);

    if(!question)
    {
        next(new CustomError("There is no such question with that ID",400));
    }

    req.data=question;
    next();

});

const checkAnswerExits=asyncErrorWrapper(async(req,res,next)=>{

   const question_id=req.params.question_id; 
   const answer_id= req.params.answer_id;


   const answer=await Answer.findOne({
    
    _id:answer_id,
    question:question_id

    });

   if(!answer)
   {
    return next(new CustomError("There is no answer with that ID associated with question ID",400));
   }

   req.data=answer;

   next();
   
});

module.exports={checkUserExits,checkQuestionExits,checkAnswerExits};