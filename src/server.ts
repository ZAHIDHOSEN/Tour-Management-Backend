/* eslint-disable no-console */
import {Server} from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from './app/config/env';
let server : Server



const startServer = async() =>{
   try{
    // console.log(envVars);
    await mongoose.connect(envVars.DB_URL)


   console.log("connect to db");

 server = app.listen(envVars.PORT, ()=>{
    console.log(`server is listening to port:${envVars.PORT}`);
   })
   }catch(error){
    console.log(error);
   }
}

startServer()

process.on("unhandledRejection", (err)=>{
    console.log("unhandledRejection detected", err);
    if(server){
        server.close(()=>{
           process.exit(1)
        })
       
    }
    process.exit(1)
})
process.on("uncaughtException", (err)=>{
    console.log("uncaughtException detected", err);
    if(server){
        server.close(()=>{
           process.exit(1)
        })
       
    }
    process.exit(1)
})
process.on("SIGTERM", ()=>{
    console.log("sigterm signal received... server shutting down ...");
    if(server){
        server.close(()=>{
           process.exit(1)
        })
       
    }
    process.exit(1)
})



// Promise.reject (new Error("I forgot to catch this error"))
// throw new Error("I forgot to handle this local")
