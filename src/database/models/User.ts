import mongoose from 'mongoose';
import {IDomainRecord} from "./DomainRecord";

const Schema = mongoose.Schema;

const UptimeStateSchema = new Schema({
    date: {type: Date, required: true},
    statusCode: {type: Number, required: true},
    responseTime: {type: Number, required: true}
});

const DomainRecordSchema = new Schema({
    hostname: {type: String, required: true, unique:true},
    uptimes: {type: [UptimeStateSchema], required: false}
});

// export interface IUser extends mongoose.Document {
//     id: string;
//     domains: [IDomainRecord]
// } bug with ts $push domain. Uncomment when ts version update

const UserSchema = new Schema({
    username: {type: String, required: true, unique: true},
    domains: {type: [DomainRecordSchema], required: false}
});
// UserSchema.path('id').validate((n: any) => {
//     return !!n && n.length >= 100;
// }, 'Invalid id');
const User = mongoose.model('User', UserSchema);
export default User;

