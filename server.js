const express = require("express");
const dotenv= require("dotenv");
const routers=require("./routers");//Default olarak index.js'i dahil edicek.
const connectDatabase=require("./helpers/database/connectDatabase");
const customErrorHandler=require("./middlewares/errors/customErrorHandler");
const path=require("path");

//Environment Variables:
dotenv.config({path:"./config/env/config.env"});

//MongoDb Connection:
connectDatabase();

const app=express();

//Express - Body Middleware

app.use(express.json());

const PORT=process.env.PORT; //O anki ortamın portu

//Routers Middlewares:
app.use("/api",routers);

//Error Handler-(Custom)
app.use(customErrorHandler);

//Static Files 
app.use(express.static(path.join(__dirname,"public")));

app.listen(PORT,()=>{
   console.log(`App started PORT ${PORT} : ${process.env.NODE_ENV}`);
});