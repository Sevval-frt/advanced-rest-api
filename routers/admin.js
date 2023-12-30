const express=require("express");
const {getAccessToRoute,getAdminAccess}=require("../middlewares/authorization/auth");
const {checkUserExits} =require("../middlewares/database/databaseErrorHelpers");
const {blockUser,deleteUser}=require("../controllers/admin");
const router=express.Router();

//Block User , Delete User.

//api/admin/

router.use([getAccessToRoute,getAdminAccess]); //Token kontrolü ve sadece Adminlerin girebileceği Middleware'lardan geçmek.
router.get("/block/:id",checkUserExits,blockUser);
router.delete("/user/:id",checkUserExits,deleteUser);

module.exports=router;