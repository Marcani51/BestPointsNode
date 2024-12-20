import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
export function isValidObjectId(redirectUrl:any){
    return async (req:Request, res:Response, next:NextFunction)=>{
        const paramId=['id','place_id','review_id'].find(param=>req.params[param])
        if(!paramId){
            return next()
        }

        const id = req.params[paramId];

        if(!mongoose.Types.ObjectId.isValid(id)){
            req.flash('error_msg','Invalid Id / data tidak ditemukan')
            return res.redirect(redirectUrl)
        }

        next()
    }
}