import mongoose from "mongoose"

const Schema = mongoose.Schema

const reviewSchema = new Schema({
    rating:Number,
    body:String
})

export const Place= mongoose.model("Review",reviewSchema)