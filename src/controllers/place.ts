import { Response, Request, NextFunction } from "express";
import { Place } from "../models/place";
import fs from 'fs'
import { ExpressError } from "../utils/ExpressError";
import * as hereMaps from "../utils/hereMaps"

export async function index(req: Request, res: Response, next: NextFunction) {
  const places = await Place.find();

  const clusteringPlace= places.map((place:any)=>{
    return {
      latitude:place.geometry.coordinates[0],
      longitude: place.geometry.coordinates[1]
    }
  })
  const clusteredPlace= JSON.stringify(clusteringPlace)
  res.render("places/index", { places, clusteredPlace });
}

export async function store(req: Request, res: Response, next: NextFunction) {
  try {
    //@ts-ignore
    const images= req.files?.map((file:any)=>({
      url: file.path,
      filename:file.filename
    }))
    const geodata = await hereMaps.geometry(req.body.place.location)
    console.log(geodata)
    
    const places = new Place(req.body.place)
    //@ts-ignore
    places.author=req.user._id
    places.images=images
    places.geometry=geodata
    await places.save();
    req.flash("succes_msg", "Place added succesfully");
    res.redirect("/places");
  } catch (error: any) {
    next(error);
  }
}

export async function show(req: Request, res: Response, next: NextFunction) {
  const place = await Place.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  res.render("places/show", { place });
}

export async function edit(req: Request, res: Response, next: NextFunction) {
  const place = await Place.findById(req.params.id);

  res.render("places/edit", { place });
}

export async function update(req: Request, res: Response, next: NextFunction) {
  const {place}=req.body
  const geodata = await hereMaps.geometry(place.location)

  const newPlace=await Place.findByIdAndUpdate(req.params.id, { ...place, geometry:geodata }, {runValidators:true, new:true});
  //@ts-ignore
  if(req.files && req.files.length > 0){
    place.images.forEach((image:any) => {
      fs.unlink(image.url,err=> new ExpressError(err,400))
    });
    //@ts-ignore
    const images= req.files.map((file:any)=>({
      url: file.path,
      filename:file.filename
    }))
    newPlace.images=images
    await newPlace.save()
  } 
  req.flash("succes_msg", "Place updated succesfully");
  res.redirect(`/places/${req.params.id}`);
}

export async function destroy(req: Request, res: Response, next: NextFunction) {
  const {id}=req.params
  const place = await Place.findById(id)
  //@ts-ignore
  if(place.images.length > 0){
    place.images.forEach((image:any) => {
      fs.unlink(image.url,err=> new ExpressError(err,400))
    });
  } 
  await Place.findByIdAndDelete(id)
  req.flash("succes_msg", "Place deleted succesfully");
  res.redirect("/places");
}

export async function destroyImage(req: Request, res: Response, next: NextFunction){
  try {
    const {id}=req.params
    const {images}=req.body

    if(!images || images.length ===0){
      req.flash('error_msg','Please select at least one image')
      return res.redirect(`/places/${id}/edit`)
    }

    images.forEach((images:any)=>{
      fs.unlink(images,err=> new ExpressError(err,400))
    })

    await Place.findByIdAndUpdate(
      id,
      {$pull:{images:{url:{$in:images}}}},
      {new:true}
    )
    req.flash('succes_msg','Succes deleted images')
      return res.redirect(`/places/${id}/edit`)

  } catch (error:any) {
    req.flash('error_msg', error)
  }
}
