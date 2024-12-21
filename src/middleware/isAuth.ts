import { Response, Request, NextFunction } from "express";

export function isAuth(req:Request, res:Response, next:NextFunction){
    if(!req.isAuthenticated()){
        req.flash('error_msg', "you are not logged in")
        res.redirect("/login")
    }
    next()
}