
import { Review } from "../models/review";
import { func as wrapAsync } from "../utils/wrapAsync";
import { ExpressError } from "../utils/ExpressError";
import { Response, Request, NextFunction } from "express";
import express from "express";
import { Place } from "../models/place";
import { isValidObjectId } from "../middleware/isValidObjectId";
import { isAuth } from "../middleware/isAuth";
import { isAuthorReview } from "../middleware/isAuthor";
import * as ReviewController from "../controllers/review";
import * as validator from "../middleware/validator"
const router = express.Router({ mergeParams: true });



router.post(
  "/",
  isAuth,
  isValidObjectId("/places"),
  validator.validateReview,
  wrapAsync(ReviewController.store)
);

router.delete(
  "/:review_id",
  isAuth,
  isAuthorReview,
  isValidObjectId("/places"),
  wrapAsync(ReviewController.destroy)
);

module.exports = router;
