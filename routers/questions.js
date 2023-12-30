const express=require("express");
const answers=require("./answers");
const Question=require("../models/question");
const {askNewQuestion,getAllQuestions,getSingleQuestion,editQuestions,deleteQuestion,likeQuestion,undoLikeQuestion}=require("../controllers/question");
const {getAccessToRoute,questionOwnerAccess} = require("../middlewares/authorization/auth");
const {checkQuestionExits} = require("../middlewares/database/databaseErrorHelpers");
const questionQueryMiddleware=require("../middlewares/query/questionQueryMiddleware");
const answerQueryMiddleware=require("../middlewares/query/answerQueryMiddleware");


const router=express.Router();

//api/questions

router.post("/ask",getAccessToRoute,askNewQuestion);
router.get("/",questionQueryMiddleware(Question,{population:{path:"user",select:"name profile_image"}}),getAllQuestions);
router.get("/:id",checkQuestionExits,answerQueryMiddleware(Question,{
    population:[
        {
        path:"user",
        select:"name profile_image"
        },
        {
        path:"answers",
        select:"user content"
        }
    ]}),getSingleQuestion);

router.get("/:id/like",[getAccessToRoute,checkQuestionExits],likeQuestion);
router.get("/:id/undo_like",[getAccessToRoute,checkQuestionExits],undoLikeQuestion);
router.put("/:id/edit",[getAccessToRoute,checkQuestionExits,questionOwnerAccess],editQuestions);
router.delete("/:id/delete",[getAccessToRoute,checkQuestionExits,questionOwnerAccess],deleteQuestion);

router.use("/:question_id/answers",checkQuestionExits,answers);



module.exports=router;