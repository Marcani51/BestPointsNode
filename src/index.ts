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


// middleware
app.use(express.urlencoded({extended:true}))
app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/places',async(req,res)=>{
    const places=await Place.find()
    res.render('places/index',{places})
})

app.get('/places/create',async(req,res)=>{
    res.render('places/create')
})

app.post('/places',async(req,res)=>{
    console.log(req.body.place)
    const places= new Place(req.body.place)
    await places.save()

    res.redirect("/places")
    
})

app.get('/places/:id',async (req,res)=>{
    const place = await Place.findById(req.params.id)
    res.render('places/show',{place})

})

// app.get('/seed/place',async (req,res)=>{
//     const place = new Place({
//         title:"Empire State Building",
//         price:"$9999999",
//         description:"A Great Building",
//         location:"New York,Ny"
//     })
//     await place.save()

//     res.send(place)
// })

app.listen(3000,()=>{
    console.log("Server runnng on port 3000")
})