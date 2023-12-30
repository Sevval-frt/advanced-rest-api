const Question=require("../models/question");
const Answer=require("../models/answer");
const CustomError=require("../helpers/error/CustomError");
const asyncErrorWrapper=require("express-async-handler");

const askNewQuestion=asyncErrorWrapper(async(req,res,next)=>{

const information=req.body;

const question=await Question.create({

    ...information, //Spread operatörü ile Tüm alanları çeker
    user: req.user.id 
});

   return res.status(200).json({
        success:true,
       data:question
    });
});

const getAllQuestions=asyncErrorWrapper(async(req,res,next)=>{

    return res.status(200).json(res.data);

});

const getSingleQuestion=asyncErrorWrapper(async(req,res,next)=>{


   return res.status(200).json(res.data);

});


const editQuestions=asyncErrorWrapper(async(req,res,next)=>{

    const {id}=req.params;

    const {title,content}= req.body;

    let question=await Question.findById(id);

    question.title=title;
    question.content=content;

    question=await question.save();


    res.status(200).json({
        success:true,
        data:question
    });

}); 

const deleteQuestion=asyncErrorWrapper(async(req,res,next)=>{

    const {id} = req.params;

    await Question.findByIdAndDelete(id);

    await Answer.deleteMany({

        question:id
    });

    res.status(200).json({
        success:true,
        message:"Question delete operation successfull"
    });
});

const likeQuestion=asyncErrorWrapper(async(req,res,next)=>{

    const userId=req.user.id;
    const {id} = req.params;

   const question= await Question.findById(id);

    if(question.likes.includes(userId))
    {   
        next(new CustomError("You already liked this question."),400);
    }
   
   question.likes.push(userId);
   question.likeCount=question.likes.length;

   await question.save();

    return res.status(200).json({
        success:true,
        message:question
    });
});

const undoLikeQuestion=asyncErrorWrapper(async(req,res,next)=>{

    const {id} = req.params;
    const userId=req.user.id;

    const question=await Question.findById(id);

    if(!question.likes.includes(userId))
    {
        next(new CustomError("you can not undo like operation for this question.",400));
    }

    const index=question.likes.indexOf(userId);

    question.likes.splice(index,1);
    question.likeCount=question.likes.length;

    await question.save();

    res.status(200).json({
        success:true,
        data:question.likes
    });
});

//Birçok fonksiyon olabilir dolayısıyla obje olarak dışarı aktarabiliriz.
module.exports={askNewQuestion,getAllQuestions,getSingleQuestion,editQuestions,deleteQuestion,likeQuestion,undoLikeQuestion};