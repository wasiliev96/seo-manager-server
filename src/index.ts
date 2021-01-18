import express from "express";
import {checkAuth} from "./auth";
import cors from 'cors';
const app = express();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const port = 8080; // default port to listen

app.use('/', checkAuth)
// define a route handler for the default home page
app.get("/", (req: express.Request, res: express.Response) => {
    res.status(200).json({'message': 'Hello'})
});
// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
export {
    app
}
