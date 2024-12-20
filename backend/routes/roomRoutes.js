const express = require('express');
const Room = require('../models/room');
const Hotel = require("../models/hotel");
const verifyAdmin = require('../utils/verifyToken');

const router = express.Router();

router.post('/:hotelid', verifyAdmin, async(req,res,next)=>{
const hotelId = req.params.hotelid;
const newRoom = new Room(req.body);

try {
  const savedRoom = await newRoom.save();
  try {
    await Hotel.findByIdAndUpdate(hotelId,{
      $push: {rooms: savedRoom._id},
    })
  } catch (error) {
    next(error)
  }
  res.status(200).json(savedRoom)
} catch (error) {
  next(error);
}
})


router.put('/:id', verifyAdmin, async (req,res,next)=>{
  try {
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id,
      {$set: req.body},
      {new: true}
    );
    res.status(200).json(updatedRoom);
  } catch (error) {
    next(error);
  }
})

router.delete("/:id/:hotelid", verifyAdmin, async(req,res,next)=>{
  const hotelId = req.params.hotelid;
  try {

    const deletedRoom = await Room.findByIdAndDelete(req.params.id);
    try {
      await Hotel.findByIdAndUpdate(hotelId,{
        $pull: {rooms: req.params.id},
      })
    } catch (error) {
      next(error)
    }
    if(!deletedRoom) {
      console.log("data is not found")
    }
    res.status(200).json("Room has been deleted.");
  } catch (error) {
    next(error);
  }
})

router.get("/:id", async(req,res,next)=>{
  try {
    const room = await Room.findById(req.params.id);
    if(!room)
    {
      console.log("Room is not available");
    }
    res.status(200).json(room);
  } catch (error) {
    next(error);
  }
})

router.get("/", async (req,res,next)=>{
  try {
    const rooms = await Room.find()
    res.status(200).json(rooms)
  } catch (error) {
    next(error)
  }
})



module.exports = router;