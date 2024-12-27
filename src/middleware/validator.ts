import { reviewSchema } from "../schemas/reviews";
import { Response, Request, NextFunction } from "express";
import { ExpressError } from "../utils/ExpressError";
import { placeSchema } from "../schemas/place";

export const validateReview = (req: Request, res: Response, next: NextFunction) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    console.log("KE VALIDATE REVIEW");
    console.log(error);
    const msg = error.details.map((el) => el.message).join(",");
    return next(new ExpressError(msg, 400));
  } else {
    next();
  }
};

export const validatePlace = (req: Request, res: Response, next: NextFunction) => {
  const { error } = placeSchema.validate(req.body);
  if (error) {
    console.log("KE VALIDATE PLACE");
    console.log(error);
    const msg = error.details.map((el) => el.message).join(",");
    return next(new ExpressError(msg, 400));
  } else {
    next();
  }
};