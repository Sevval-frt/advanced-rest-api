const mongoose = require("mongoose");
const Schema=mongoose.Schema;
const Question=require("./question");
const CustomError=require("../helpers/error/CustomError");


const AnswerSchema=new Schema({

content:{
    type:String,
    required:[true,"Please provide a content"],
    minlength:[10,"Please provide a content at least 10 characters"]
    },
user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
creatAt:{
    type:Date,
    default:Date.now
    },
likeCount:{
    type:Number,
    default:0
},    
likes:[
    {
        type:mongoose.Schema.ObjectId,
        ref:"User"
    }
],
question:{
    type:mongoose.Schema.ObjectId,
    ref:"Question",
    required:true
}
});

/* Pre fonksiyonunun içindeki findById() metodunu sistem nedenini bilmediğim bir şekilde görmediği için burayı not olarak aldım ama mantık aynı!*/

// AnswerSchema.pre("save",async function(next){

//     // if (!this.isModified("user")) return next();

//     try{
      
//        const question= await Question.findById(this.question);
  
//         question.answers.push(this._id);
    
//         await question.save();
    
//         next();

//     }
//    catch(err)
//    {
//     return next(err);
//    }
// });


module.exports=mongoose.model("Answer",AnswerSchema);