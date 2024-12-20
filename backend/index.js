const express = require('express');
require('dotenv').config();
const db = require('./db');
const app = express();

const authRoute = require("./routes/authRoutes");
const usersRoute = require("./routes/usersRoutes");
const roomRoute = require("./routes/roomRoutes");
const hotelRoute = require("./routes/hotelRoutes");
const cookieParser = require('cookie-parser');
const cors = require('cors');


app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/auth",authRoute);
app.use("/users",usersRoute);
app.use("/room",roomRoute);
app.use("/hotel",hotelRoute);

app.use((err,req,res,next)=>{
  const errorStatus = err.status || 500
  const errorMessage = err.message || "something went wrong!"
  return res.status(errorStatus).json({
    success:false,
    status:errorStatus,
    message:errorMessage,
    stack:err.stack,
  })
})

app.listen(8800, ()=>{
  console.log("connected to backend!");
})