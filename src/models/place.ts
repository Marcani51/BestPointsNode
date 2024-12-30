import mongoose from "mongoose"
import { Review } from "./review"
import { geometry } from "../utils/hereMaps"

const Schema = mongoose.Schema

const placeSchema = new Schema({
    title:String,
    price:String,
    description:String,
    location:String,
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    images:[
        {
            url:String,
            filename:String
        }
    ],
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:'Review'
    }]
})

placeSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await Review.deleteMany({_id:{$in: doc.reviews}})
    }
})

export const Place= mongoose.model("Place",placeSchema)