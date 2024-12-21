import { reviewSchema } from "../schemas/reviews";
import { Review } from "../models/review";
import {func as wrapAsync} from "../utils/wrapAsync"
import { ExpressError } from "../utils/ExpressError";
import { Response, Request, NextFunction } from "express";
import express from "express";
import { Place } from "../models/place";
import { isValidObjectId } from "../middleware/isValidObjectId";
import { isAuth } from "../middleware/isAuth";
const router= express.Router({mergeParams:true})

const validateReview=(req:Request, res:Response, next:NextFunction)=>{
    const {error}= reviewSchema.validate(req.body)
    if(error){
        console.log("KE VALIDATE REVIEW")
        console.log(error)
        const msg= error.details.map(el=>el.message).join(',')
        return next(new ExpressError(msg,400))
    }else{
        next();
    }
  }

router.post("/", isAuth, isValidObjectId('/places'),validateReview,wrapAsync(async(req:any, res:any)=>{
    const{place_id}= req.params
    const review= new Review(req.body.review)
    const place= await Place.findById(place_id)
    if(place!=undefined){
      //@ts-ignore
      place?.reviews.push(review)
      await review.save()
      await place.save()
      req.flash('succes_msg',"Review added succesfully")
      res.redirect(`/places/${place_id}`)
    }
  }))
  
  router.delete('/:review_id', isAuth, isValidObjectId('/places'),wrapAsync(async(req:Request, res:Response)=>{
    const {place_id, review_id}=req.params
    await Place.findByIdAndUpdate(place_id,{$pull:{reviews:review_id}})
    await Review.findByIdAndDelete(review_id)
    req.flash('succes_msg',"Place deleted succesfully")
    res.redirect(`/places/${place_id}`)
  }))

  module.exports=router
  