import mongoose, {Schema} from 'mongoose';
import UptimeState, {IUptimeState, UptimeStateSchema} from "./UptimeState";

export interface IDomainRecord extends mongoose.Document {
    hostname: string;
    uptimes: [IUptimeState],
    expiryDate: Date
}

export const DomainRecordSchema = new mongoose.Schema({
    hostname: {type: String, required: true},
    uptimes: {type: [UptimeStateSchema], required: true},
    expiryDate: {type: Date, required: false}
});
DomainRecordSchema.path('hostname').validate((n: any) => {
    return !!n && n.length >= 10;
}, 'Invalid id');
// {
//     userId:string,
//         {
//             url:URL,
//             uptimes:{
//                 date:Date,
//                 status:number,
//                 responseTime:float
//             }[]
//         }[]
// }[]
