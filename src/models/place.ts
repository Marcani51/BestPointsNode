import mongoose from "mongoose"

const Schema = mongoose.Schema

const placeSchema = new Schema({
    title:String,
    price:String,
    description:String,
    location:String,
    image:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:'Review'
    }]
})

export const Place= mongoose.model("Place",placeSchema)