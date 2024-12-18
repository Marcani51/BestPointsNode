import Joi from "joi";

export const placeSchema= Joi.object({
    place:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        price:Joi.number().min(0).required(),
        location:Joi.string().required(),
        image:Joi.string().required()
    }).required()
})

