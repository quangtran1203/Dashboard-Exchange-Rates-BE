/**
 * To connect and interact with MongoDB's database, I'm using the Mongoose package.
 * Mongoose provides ORM functionalities making it more streamlined to create and manipulate the DB.
 */

import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import router from "./routes.js";
import "express-async-errors";

// setting up express server
const app = express();
app.disable("x-powered-by"); //Reduce fingerprinting
app.use(cors());
app.use(express.json());

// configure and connect to MongoDB database
mongoose.Promise = global.Promise;
mongoose.set("strictQuery", false);
mongoose
    .connect(
        "mongodb+srv://minhquangtran1203:x988j45AwgZODTOs@dashboarddb.rrnnt0p.mongodb.net/?retryWrites=true&w=majority&appName=dashboardDB"
    )
    .then(() => console.log("Connected to DB!"))
    .catch((err) => console.log(err));

// api routes
app.use("/api", router);

// extra error handling layer from express-async-errors --> catch any client or server errors
app.use((err, req, res, next) => {
    if (err.message === "error-custom") {
        res.status(err.statusCode);
        res.json({
            message: err.errorMessage,
            status: err.statusCode,
        });
        return;
    }
    res.status(500).json({
        status: 500,
        message: err.message,
    });
    next();
});

// listen on PORT
app.listen(8000, () => {
    console.log("Server is online at port 8000");
});
