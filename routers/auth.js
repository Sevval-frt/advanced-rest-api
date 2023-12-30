const express=require("express");
const {register,getUser,login,logout,imageUpload,forgotpassword,resetPassword,editProfile}=require("../controllers/auth");
const {getAccessToRoute}=require("../middlewares/authorization/auth");
const {profileImageUpload}=require("../middlewares/libraries/profileImageUpload");

const router =express.Router();

//api/auth/...

router.post("/register",register);
router.post("/login",login);
router.get("/profile",getAccessToRoute,getUser);
router.get("/logout",getAccessToRoute,logout);
router.put("/resetpassword",resetPassword);
router.put("/edit",getAccessToRoute,editProfile);
router.post("/forgotpassword",forgotpassword);
router.post("/upload",[getAccessToRoute,profileImageUpload.single("profile_image")],imageUpload);

module.exports = router;