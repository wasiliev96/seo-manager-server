import mongoose from 'mongoose';
import {IDomainRecord} from "./DomainRecord";

const Schema = mongoose.Schema;

const UptimeStateSchema = new Schema({
    date: {type: Date, required: true},
    statusCode: {type: Number, required: true},
    responseTime: {type: Number, required: true}
});

const DomainRecordSchema = new Schema({
    hostname: {type: String, required: true},
    uptimes: {type: [UptimeStateSchema], required: false}
});

export interface IUser extends mongoose.Document {
    id: string;
    domains: [IDomainRecord]
}

const UserSchema = new Schema({
    userId: {type: String, required: true, unique: true},
    domains: {type: [DomainRecordSchema], required: true, validate: (v: any) => Array.isArray(v) && v.length > 0}
});
// UserSchema.path('id').validate((n: any) => {
//     return !!n && n.length >= 100;
// }, 'Invalid id');
const User = mongoose.model<IUser>('User', UserSchema);
export default User;

