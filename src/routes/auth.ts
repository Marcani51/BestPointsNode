import express from "express"
const router= express.Router()
import { Response, Request, NextFunction } from "express";
import { User } from "../models/user"
import {func as wrapAsync} from "../utils/wrapAsync"
import passport from "passport";
import * as AuthController from "../controllers/auth"

router.route("/register")
.get(AuthController.registerForm)
.post(wrapAsync(AuthController.store))

router.get('/login',(req:Request,res:Response)=>{
    res.render('auth/login')
})

//@ts-ignore
router.post('/login',passport.authenticate('local',{
    failureRedirect:'/login',
    failureFlash:{
        type:'error_msg',
        msg:'Invalid username and password'
    }
}),AuthController.login)

router.post('/logout',AuthController.logout)
module.exports=router