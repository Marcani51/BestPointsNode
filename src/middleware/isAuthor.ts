import { Response, Request, NextFunction } from "express";
import { Place } from "../models/place";
import { Review } from "../models/review";
export async function isAuthorPlace(req:Request, res:Response, next:NextFunction){
    const {id}=req.params
    let place=await Place.findById(id)
    
    //@ts-ignore
    if(!place.author.equals(req.user?._id)){
        req.flash('error_msg',"Not Authorize")
        return res.redirect('/places')
    }

    next()
}

export async function isAuthorReview(req:Request, res:Response, next:NextFunction){
    const {review_id, place_id}=req.params
    let review=await Review.findById(review_id)
    
    //@ts-ignore
    if(!review.author.equals(req.user?._id)){
        req.flash('error_msg',"Not Authorize")
        return res.redirect(`/places/${place_id}`)
    }

    next()
}