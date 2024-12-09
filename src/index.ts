import ejsMate from "ejs-mate"
import express from "express"
import path from "path"
import mongoose from "mongoose"
import { Place } from "./models/place"
import methodOverride from 'method-override'

const app = express()

// connect to mongoose mac

mongoose.connect("mongodb://127.0.0.1:27017/bestpoints")
    .then((result:any)=>{
        console.log("Succes connect to MongoDB")
    }).catch((err:any)=>{
        console.log(err)
    })

// connect to mongoose windows
// mongoose.connect("mongodb://127.0.0.1/bestpoints")
//     .then((result:any)=>{
//         console.log("Succes connect to MongoDB")
//     }).catch((err:any)=>{
//         console.log(err)
//     })

//@ts-ignore
app.engine("ejs", ejsMate)
app.set('view engine','ejs')
app.set('views', path.join(__dirname, "views"))


// middleware
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))

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

app.get('/places/:id/edit', async(req,res)=>{
    const place = await Place.findById(req.params.id)

    res.render('places/edit',{place})
})

app.put('/places/:id',async (req,res)=>{
    await Place.findByIdAndUpdate(req.params.id, {...req.body.place})

    res.redirect("/places")
})

app.delete('/places/:id',async (req,res)=>{
    await Place.findByIdAndDelete(req.params.id)
    res.redirect('/places')
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