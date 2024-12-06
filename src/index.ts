import express from "express"
import path from "path"
import mongoose from "mongoose"
import { Place } from "./models/place"

const app = express()

// connect to mongoose

mongoose.connect("mongodb://127.0.0.1:27017/bestpoints")
    .then((result:any)=>{
        console.log("Succes connect to MongoDB")
    }).catch((err:any)=>{
        console.log(err)
    })

app.set('view engine','ejs')
app.set('views', path.join(__dirname, "views"))


app.get('/',(req,res)=>{
    res.render('home')
})
app.get('/seed/place',async (req,res)=>{
    const place = new Place({
        title:"Empire State Building",
        price:"$9999999",
        description:"A Great Building",
        location:"New York,Ny"
    })
    await place.save()

    res.send(place)
})
app.listen(3000,()=>{
    console.log("Server runnng on port 3000")
})