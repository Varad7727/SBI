const express=require("express");
const authController=require("../controller/auth.controller");

const router=express.Router();


//register
//post:/api/auth/register 
router.post("/register",authController.userRegisterController);


//login
/*
POST:/api/auth/login
*/
router.post("/login",authController.userLoginController);
module.exports = router;