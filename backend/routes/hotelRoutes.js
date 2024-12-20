const express = require('express');
const verifyAdmin = require('../utils/verifyToken');
const hotel = require('../models/hotel');
// const createError = require('../utils/error');

const router = express.Router();

//CREATE
router.post("/",verifyAdmin, async (req,res,next) =>{
  const newHotel = new hotel(req.body)
 
  try {
    const saveHotel = await newHotel.save();
    res.status(200).json(saveHotel)
  } catch (error) {
    next(error);
  }
})
//UPDATE
router.put("/:id",verifyAdmin, async (req,res,next)=>{
  try {
    const updatedData = req.body;
    const updatedHotel = await hotel.findByIdAndUpdate(req.params.id,updatedData,
      {
      new: true,
      runValidators:true
      }
    );
    if(!updatedData){
      return res.status(401).json({error:"data is not found"})
    }
    console.log("data updated");
    res.status(200).json(updatedHotel)
  } catch (error) {
    next(error);
  }
}
)
//DELETE
router.delete("/:id",verifyAdmin, async (req,res,next)=>{
  try {
    const deleteHotel = await hotel.findByIdAndDelete(req.params.id);
    if(!deleteHotel){
      return res.status(401).json({error:"data is not found"})
    }
    console.log("data deleted");
    res.status(200).json("hotel has been deleted")
  } catch (error) {
    next(error)
  }
})
//GET
router.get("/find/:id",async (req,res,next)=>{
  try {
    const hotel1 = await hotel.findById(req.params.id);
    if(!hotel1){
      return res.status(401).json({error:"data is not found"})
    }
    console.log("data fetched");
    res.status(200).json(hotel1)
  } catch (error) {
    next(error)
  }
})
//GETALL
router.get("/", async (req,res,next)=>{
  const {min,max,...others} = req.query;
  try {
    const hotels = await hotel.find(
      {...others, chepestPrice : {$gt :min | 1, $lt :max || 900},}
    ).limit(4);
    if(!hotels){
      return res.status(401).json({error:"data is not found"})
    }
    res.status(200).json(hotels)
  } catch (error) {
    next(error);
    // res.status(500).json(error);

  }
})

router.get("/countByCity", async (req,res,next)=>{
  const cities = req.query.cities.split(",")
  try {
    const list = await Promise.all(cities.map(city =>{
      return hotel.countDocuments({city:city})
    }))
    if(!hotel){
      return res.status(401).json({error:"data is not found"})
    }
    console.log("data fetched");
    res.status(200).json(list)
  } catch (error) {
    next(error);
    // res.status(500).json(error);

  }
})

router.get("/countByType", async (req,res,next)=>{

  try {
    const hotelCount = await hotel.countDocuments({type:"hotel"});
    const apartmentCount = await hotel.countDocuments({type:"apartment"});
    const resortCount = await hotel.countDocuments({type:"resort"});
    const villaCount = await hotel.countDocuments({type:"villa"});
    const cabinCount = await hotel.countDocuments({type:"cabin"});
    
    res.status(200).json([
      {type:"hotel",count:hotelCount},
      {type:"apartment",count:apartmentCount},
      {type:"resort",count:resortCount},
      {type:"villa",count:villaCount},
      {type:"cabin",count:cabinCount},
    ])
  } catch (error) {
    next(error);
    // res.status(500).json(error);

  }
})



module.exports = router;