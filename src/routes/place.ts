import { placeSchema } from "../schemas/place";
import { Place } from "../models/place";
import { Response, Request, NextFunction } from "express";
import { ExpressError } from "../utils/ExpressError";
import {func as wrapAsync} from "../utils/wrapAsync"
import express from "express";
import { isValidObjectId } from "../middleware/isValidObjectId";
import { isAuth } from "../middleware/isAuth";
import { isAuthorPlace } from "../middleware/isAuthor";

const router= express.Router()

const validatePlace=(req:Request, res:Response, next:NextFunction)=>{
    const {error}= placeSchema.validate(req.body)
    if(error){
        console.log("KE VALIDATE PLACE")
        console.log(error)
        const msg= error.details.map(el=>el.message).join(',')
        return next(new ExpressError(msg,400))
    }else{
        next();
    }
}

router.get("/", wrapAsync(async (req:any, res:any) => {

    const places = await Place.find();
    res.render("places/index", { places });
  }));

router.get("/create", isAuth, wrapAsync( async (req:any, res:any) => {
    res.render("places/create");
  }));

router.post("/", isAuth, validatePlace, wrapAsync(async (req:any, res:any, next:any) => {
    try {
      const places = new Place(req.body.place);
      await places.save();
      req.flash('succes_msg',"Place added succesfully")
      res.redirect("/places");
    } catch (error:any) {
      next(error)
    }
      
  }));

router.get("/:id",isValidObjectId('/places'), wrapAsync(async (req:any, res:any) => {
    const place = await Place.findById(req.params.id)
      .populate({
        path:'reviews',
        populate:{
          path:'author'
        }
      })
      .populate("author");
    res.render("places/show", { place });
  }));

router.get("/:id/edit", isAuth, isAuthorPlace, isValidObjectId('/places'), wrapAsync( async (req:any, res:any) => {
    const place = await Place.findById(req.params.id);
  
    res.render("places/edit", { place });
  }));

router.put("/:id", isAuth, isAuthorPlace, isValidObjectId('/places'), validatePlace,wrapAsync(async (req:any, res:any) => {
    await Place.findByIdAndUpdate(req.params.id, { ...req.body.place });
    req.flash('succes_msg',"Place updated succesfully")
    res.redirect(`/places/${req.params.id}`);
  }));

router.delete("/:id", isAuth, isAuthorPlace, isValidObjectId('/places'), wrapAsync(async (req:any, res:any) => {
    console.log(req.params.id)
  await Place.findByIdAndDelete(req.params.id);
  req.flash('succes_msg',"Place deleted succesfully")
  res.redirect("/places");
}));

module.exports=router