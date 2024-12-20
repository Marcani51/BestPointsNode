import ejsMate from "ejs-mate";
import express from "express";
import { Response, Request, NextFunction } from "express";
import path from "path";
import mongoose from "mongoose";
import session from "express-session"
import flash from "connect-flash"
import methodOverride from "method-override";
import { ExpressError } from "./utils/ExpressError";


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
app.use(express.static(path.join(__dirname, "public")))
app.use(session({
  secret:'this-is-a-secret-key',
  resave:false,
  saveUninitialized:false,
  cookie:{
    httpOnly:true,
    maxAge: 1000*60*60*24*7

  }
}))
app.use(flash())

app.use((req: Request, res:Response, next:NextFunction)=>{
  res.locals.succes_msg=req.flash('succes_msg')
  res.locals.error_msg=req.flash('error_msg')
  
  next()
})
///// routing

app.get("/", (req, res) => {
  res.render("home");
});

app.use('/places', require('./routes/place'))
app.use('/places/:place_id/reviews',require('./routes/review'))


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
