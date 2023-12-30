const Answer=require("../models/answer");
const Question=require("../models/question");
const CustomError=require("../helpers/error/CustomError");
const asyncErrorWrapper=require("express-async-handler");

const addNewAnswerToQuestion=asyncErrorWrapper(async(req,res,next)=>{

const {question_id}=req.params;
const user_id=req.user.id;
const answerInput=req.body;

const answer= await Answer.create({
   
    ...answerInput,
    user:user_id,
    question:question_id
});

const question= await Question.findById(question_id);
  
      question.answers.push(answer._id);
      question.answerCount=question.answers.length;
       await question.save();


res.status(200).json({
    success:true,
    message:answer
    });
});

const getAllAnswers=asyncErrorWrapper(async(req,res,next)=>{

const {question_id}=req.params;

const question= await Question.findById(question_id).populate("answers");

const answers=question.answers;


    res.status(200).json({
        success:true,
        count:answers.length,
        data:answers
    });

});

const getSingleAnswer=asyncErrorWrapper(async(req,res,next)=>{

const {answer_id}=req.params;

const answer=await Answer.findById(answer_id).
    populate(
        {
            path:"question",
            select:"title"
        }
    ).
    populate({
        path:"user",
        select:"name profile_image"
    });


 return res.status(200).json({
        success:true,
        data:answer
    });

});  

const editAnswer=asyncErrorWrapper(async(req,res,next)=>{
 
    const {content}=req.body;
    const {answer_id}=req.params;

    let answer=await Answer.findById(answer_id).
    populate({
        path:"user",
        select:"name profile_image" 
    }).
    populate({
        path:"question",
        select:"title"
    });;

    answer.content=content;

    answer=await answer.save();

    return res.status(200).json({
        success:true,
        message:answer
    });

}); 

const deleteAnswer=asyncErrorWrapper(async(req,res,next)=>{

    const {answer_id}=req.params;

    const {question_id} = req.params;
   
    await Answer.findByIdAndRemove(answer_id);

    const question=await Question.findById(question_id);
    
    question.answers.splice(question.answers.indexOf(answer_id),1);

    question.answerCount=question.answers.length;

    await question.save();

    
   return res.status(200).json({
        success:true,
        message:"Answer delete operation successfull"
    });

});   

const likeAnswer=asyncErrorWrapper(async(req,res,next)=>{

    const {answer_id}=req.params;
    const {id}= req.user;

    const answer=await Answer.findById(answer_id);

    if(!answer.likes.includes(id))
    {
        answer.likes.push(id);
        answer.likeCount=answer.likes.length;
        await answer.save();    
    }

    else
    {
        answer.likes.splice(answer.likes.indexOf(id),1);
        answer.likeCount=answer.likes.length;
        await answer.save();
    }
      

return res.status(200).json({
    success:true,
    data:answer.likes
});

});

module.exports={addNewAnswerToQuestion,getAllAnswers,getSingleAnswer,editAnswer,deleteAnswer,likeAnswer};