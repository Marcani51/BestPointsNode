import mongoose from "mongoose"

const Schema = mongoose.Schema

const placeSchema = new Schema({
    title:String,
    price:String,
    description:String,
    location:String
})

export const Place= mongoose.model("Place",placeSchema)