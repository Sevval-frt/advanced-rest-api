const express=require("express");
const User=require("../models/user");
const {checkUserExits}=require("../middlewares/database/databaseErrorHelpers");
const {getSingleUser,getAllUsers}=require("../controllers/user");
const userQueryMiddleware=require("../middlewares/query/userQueryMiddleware");


const router =express.Router();

// /api/users/...

router.get("/",userQueryMiddleware(User),getAllUsers);
router.get("/:id",checkUserExits,getSingleUser); //express modülünde id'yi dinamik olarak alma syntax'ı.


module.exports=router;