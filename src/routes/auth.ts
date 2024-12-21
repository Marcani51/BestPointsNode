import express from "express"
const router= express.Router()
import { Response, Request, NextFunction } from "express";
import { User } from "../models/user"
import {func as wrapAsync} from "../utils/wrapAsync"
import passport from "passport";
router.get('/register',(req,res)=>{
    res.render('auth/register')
})

router.post('/register',wrapAsync(async (req:Request,res:Response)=>{
    try {
        const {email, username, password}=req.body
        const user = new User({email, username})
        await User.register(user, password)
        req.flash('succes_msg',"You are registered and can log in")
        res.redirect('/login')
    } catch (error:any) {
        req.flash('error_msg',error.message)
        res.redirect("/register")
    }
}) )

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
}),(req:Request, res:Response)=>{
    req.flash("succes_msg","Your are log in")
    res.redirect("/places")
})

router.post('/logout',(req:Request, res:Response, next:NextFunction)=>{
    req.logout(function (err:any){
        if(err){return next(err)}
        req.flash("succes_msg","You are log out")
        res.redirect("/login")
    })
})
module.exports=router