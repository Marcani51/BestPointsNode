import ejsMate from "ejs-mate";
import express from "express";
import Joi from 'joi'
import { Response, Request, NextFunction } from "express";
import path from "path";
import mongoose from "mongoose";
import { Place } from "./models/place";
import methodOverride from "method-override";
import {func as wrapAsync} from "./utils/wrapAsync"
import { ExpressError } from "./utils/ExpressError";
import { placeSchema } from "./schemas/place";
const app = express();

// connect to mongoose mac

mongoose
  .connect("mongodb://127.0.0.1:27017/bestpoints")
  .then((result: any) => {
    console.log("Succes connect to MongoDB");
  })
  .catch((err: any) => {
    console.log(err);
  });

// connect to mongoose windows
// mongoose.connect("mongodb://127.0.0.1/bestpoints")
//     .then((result:any)=>{
//         console.log("Succes connect to MongoDB")
//     }).catch((err:any)=>{
//         console.log(err)
//     })

//@ts-ignore
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const validatePlace=(req:Request, res:Response, next:NextFunction)=>{
    const {error}= placeSchema.validate(req.body)
    if(error){
        console.log(error)
        const msg= error.details.map(el=>el.message).join(',')
        return next(new ExpressError(msg,400))
    }else{
        next();
    }
}

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/places", wrapAsync(async (req:any, res:any) => {
    const places = await Place.find();
    res.render("places/index", { places });
  }));

app.get("/places/create",wrapAsync( async (req:any, res:any) => {
    res.render("places/create");
  }));

app.post("/places",validatePlace, wrapAsync(async (req:any, res:any, next:any) => {
    try {
      const places = new Place(req.body.place);
      await places.save();
  
      res.redirect("/places");
    } catch (error:any) {
      next(error)
    }
      
  }));

app.get("/places/:id", wrapAsync(async (req:any, res:any) => {
    const place = await Place.findById(req.params.id);
    res.render("places/show", { place });
  }));

app.get("/places/:id/edit", wrapAsync( async (req:any, res:any) => {
    const place = await Place.findById(req.params.id);
  
    res.render("places/edit", { place });
  }));

app.put("/places/:id", validatePlace,wrapAsync(async (req:any, res:any) => {
    await Place.findByIdAndUpdate(req.params.id, { ...req.body.place });
  
    res.redirect("/places");
  }));

app.delete("/places/:id", wrapAsync(async (req:any, res:any) => {
    console.log(req.params.id)
  await Place.findByIdAndDelete(req.params.id);
  res.redirect("/places");
}));

app.all('*',(req, res, next)=>{
    next(new ExpressError('Page Not Found', 404))
})

app.use((err:any, req:Request, res:Response, next:NextFunction) => {
    console.log(err)
    const {statusCode=500}=err
    if(!err.message)err.message="Oh No, Something went wrong"
    res.status(statusCode).render('error',{err})
})

app.listen(3000, () => {
  console.log("Server runnng on port 3000");
});
