import mongoose from "mongoose";
import axios from "axios";

mongoose.connect(
    'mongodb://localhost:27017/userData?readPreference=primary&appname=MongoDB%20Compass&ssl=false',
    {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('Connected to database');
    })
    .catch((err) => {
        console.log('Error connecting to DB', err.message);
    });

axios.post('mongodb://localhost:27017/userData?readPreference=primary&appname=MongoDB%20Compass&ssl=false', {message:"Hello"});
