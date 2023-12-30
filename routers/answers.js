const express=require("express");
const {getAccessToRoute,answerOwnerAccess}=require("../middlewares/authorization/auth");
const {checkAnswerExits}=require("../middlewares/database/databaseErrorHelpers");
const {addNewAnswerToQuestion,getAllAnswers,getSingleAnswer,editAnswer,deleteAnswer,likeAnswer}=require("../controllers/answer");
const router=express.Router({mergeParams:true}); // Önceki Routerdaki parametreleri buraya geçir.

// /:question_id/answers/...

router.post("/",getAccessToRoute,addNewAnswerToQuestion);
router.get("/",getAllAnswers);
router.get("/:answer_id",checkAnswerExits,getSingleAnswer);
router.put("/:answer_id/edit",[checkAnswerExits,getAccessToRoute,answerOwnerAccess],editAnswer);
router.delete("/:answer_id/delete",[checkAnswerExits,getAccessToRoute,answerOwnerAccess],deleteAnswer);
router.get("/:answer_id/like",[checkAnswerExits,getAccessToRoute],likeAnswer);

module.exports=router;