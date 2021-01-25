import express from "express";
import {checkAuth} from "./auth";
import cors from 'cors';
import mongoose from "mongoose";
import User, {IUser} from "./database/models/User";

const app = express();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const port = 8080; // default port to listen

app.use('/auth', checkAuth)
// define a route handler for the default home page
app.get("/", (req: express.Request, res: express.Response) => {
    res.status(200).json({'message': 'Hello'})
});
// start the Express server
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`server started at http://localhost:${port}`);
    });
}

mongoose.connect(
    'mongodb://localhost:27017/test',
    {useCreateIndex:true,useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log(`Connection established`)
});

// const user: IUser = new User({
//     userId: Math.random().toString(),
//     domains: [
//         {
//             hostname: 'google.com',
//             uptimes: [
//                 {
//                     date: new Date(),
//                     statusCode: 200,
//                     responseTime: 300
//                 }
//             ]
//         }
//     ]
// });
// user.save().then((newUser) => {
//     console.log(newUser);
// },
//     (reason)=>{
//         console.log(`reason:`)
//         console.log(reason);
//     });
export {
    app
}
