
import { Place } from "../models/place";
import { Response, Request, NextFunction } from "express";
import { ExpressError } from "../utils/ExpressError";
import { func as wrapAsync } from "../utils/wrapAsync";
import express from "express";
import { isValidObjectId } from "../middleware/isValidObjectId";
import { isAuth } from "../middleware/isAuth";
import { isAuthorPlace } from "../middleware/isAuthor";
import * as PlaceController from "../controllers/place";
import * as validator from "../middleware/validator"
import { upload } from "../configs/multer";
const router = express.Router();



router
  .route("/")
  .get(wrapAsync(PlaceController.index))
  .post(isAuth, upload.array('image',5), validator.validatePlace, wrapAsync(PlaceController.store))
  

router.get(
  "/create",
  isAuth,
  wrapAsync(async (req: any, res: any) => {
    res.render("places/create");
  })
);

router
  .route("/:id")
  .put(
    isAuth,
    isAuthorPlace,
    isValidObjectId("/places"),
    upload.array('image',5),
    validator.validatePlace,
    wrapAsync(PlaceController.update)
  )
  .delete(
    isAuth,
    isAuthorPlace,
    isValidObjectId("/places"),
    wrapAsync(PlaceController.destroy)
  )
  .get(isValidObjectId("/places"), wrapAsync(PlaceController.show));

router.get(
  "/:id/edit",
  isAuth,
  isAuthorPlace,
  isValidObjectId("/places"),
  wrapAsync(PlaceController.edit)
);

router.delete("/:id/images", isAuth,
  isAuthorPlace,
  isValidObjectId("/places"),
  wrapAsync(PlaceController.destroyImage))

module.exports = router;
