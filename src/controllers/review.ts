import { Response, Request, NextFunction } from "express";
import { Place } from "../models/place";
import { Review } from "../models/review";

export async function store(req: Request, res: Response, next: NextFunction) {
  const { place_id } = req.params;

  const review = new Review(req.body.review);
  //@ts-ignore
  review.author = req.user._id;
  await review.save();
  const place = await Place.findById(place_id);

  if (place != undefined) {
    //@ts-ignore
    place?.reviews.push(review);

    await place.save();
    req.flash("succes_msg", "Review added succesfully");
    res.redirect(`/places/${place_id}`);
  }
}


export async function destroy(req: Request, res: Response, next: NextFunction){
    const {place_id, review_id}=req.params
    await Place.findByIdAndUpdate(place_id,{$pull:{reviews:review_id}})
    await Review.findByIdAndDelete(review_id)
    req.flash('succes_msg',"Place deleted succesfully")
    res.redirect(`/places/${place_id}`)
}
