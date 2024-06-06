import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cors from 'cors';
import userRouter from './routes/user.js'
import SocialmediaRouter from './routes/Socialmedia_Routes.js'
import taskRouter from './routes/tasks.js'
import bonusRouter from './routes/dailyBonus.js'
import bodyParser from "body-parser";

const app = express();
const port = 4001;

app.use(
  //  https://jjlm7kps-3000.inc1.devtunnels.ms  https://hassan3322751.github.io
    cors({
      origin: ['https://hassan3322751.github.io',
      'https://jjlm7kps-3000.inc1.devtunnels.ms',
      'http://localhost:3000','https://localhost:3000'], // Replace with your React app's URL.
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE'], 
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
);
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");

app.use( userRouter );
app.use( SocialmediaRouter )
app.use( taskRouter );
app.use( bonusRouter )

mongoose.connect("mongodb://127.0.0.1:27017", {
    dbName: "User-Auth",
}).then(() => console.log("MongoDb is working")).catch((e) => console.log(e));

app.listen(port, () => {
    console.log(`server is working on ${port}`);
});