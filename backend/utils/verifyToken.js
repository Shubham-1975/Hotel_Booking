const jwt = require("jsonwebtoken");
const createError = require("../utils/error");
const user = require("../models/user");

const { promisify } = require('util');
const jwtVerify = promisify(jwt.verify);

const verifyUser = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
        if (!token) {
            return next(createError(401, "You are not authenticated"));
        }

        const decodedToken = await jwtVerify(token, process.env.JWT_SECREAT);
        if(!decodedToken){
          return res.status(404).json("token expired !");
        }
        console.log("token id",decodedToken);
      if (decodedToken.id === req.params.id || decodedToken.isAdmin) {
          next();
      } else {
          return next(createError(403, "You are not hhh authorized!"));
      }
  } catch (err) {
      next(err);
  }
};

const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
        if (!token) {
            return next(createError(401, "You are not authenticated"));
        }

        const decodedToken = await jwtVerify(token, process.env.JWT_SECREAT);
        if(!decodedToken){
          return res.status(404).json("token expired !");
        }
        if(decodedToken.isAdmin){
          next();
          
        }else{
          return next(createError(401, "You are not jjjj authorized "));
        }
  } catch (err) {
      next(err);
  }
};

module.exports = verifyAdmin , verifyUser;

