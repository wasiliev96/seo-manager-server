import mongoose, {Document} from "mongoose";
import axios from "axios";
import User from "../models/User";

mongoose.connect(
    'mongodb://localhost:27017/test?readPreference=primary&appname=MongoDB%20Compass&ssl=false',
    {useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .then(() => {
        console.log('Connected to database');
    })
    .catch((err) => {
        console.log('Error connecting to DB', err.message);
    });

// axios.post('mongodb://localhost:27017/userData?readPreference=primary&appname=MongoDB%20Compass&ssl=false', {message: "Hello"});

export const addUser = async (userObj: any) => {
    const user = new User(userObj);
    try {
        return await user.save();
    } catch (e) {
        console.log(e);
    }
}

export const addDomainToUser = async (userId: string, domain: string) => {
    const newDomain = {hostname: domain}
    // only unique domains!
    User.findOneAndUpdate({_id: userId, 'domains.hostname': {$ne: domain}},
        {$addToSet: {domains: newDomain}},
        {new: true},
        async (err: Error, updatedUser) => {
            if (err) {
                console.log(err);
            }
            // console.log("Обновленный объект", updatedUser);
        })
}

export const removeDomainById = async (userId: string, domainId: string) => {
    User.findOneAndUpdate({_id: userId}, {$pull: {domains: {_id: domainId}}}, {new: true}, (err: Error) => {
        if (err) {
            console.log(err)
        }
    })
}

export const getUserData = async (userId: string) => {
    const userData = await User.findById(userId);
    console.log(userData);
    return userData;
}
