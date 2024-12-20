const express = require('express');
const bcrypt = require('bcrypt');
const user = require("../models/user");
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post("/register", async (req,res,next) =>{
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password,salt);
    const newUser = new user({
      username:req.body.username,
      email:req.body.email,
      password:hash,
    })
    await newUser.save()
  res.status(200).send("User has been created.")
  } catch (error) {
    console.log("error is",error)
    next(error);
  }
  }
  );
router.post("/login", async (req,res,next) =>{
  try {
  const User = await user.findOne({username:req.body.username})
  if(!User) return res.status(404).json({error:"user not found"})

    const isPasswordCorrect = await bcrypt.compare(req.body.password, User.password)
    if(!isPasswordCorrect) return  res.status(404).json({error:"wrong password or username"})

      const token = jwt.sign({id:User._id, isAdmin:User.isAdmin},
        process.env.JWT_SECREAT
      );
      console.log(token);
      const {password,isAdmin,...otherDetails} = User._doc;
      console.log(User._doc)
  res
  .cookie("access_token",token,{
    httpOnly:true,
  })
  .status(200).json({...otherDetails});
  
  } catch (error) {
    next(error);
  }
  });

module.exports = router;