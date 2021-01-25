import mongoose from 'mongoose';
const { Schema } = mongoose;
export interface IUptimeState extends mongoose.Document {
    date: Date;
    statusCode: number;
    responseTime: number;
}

export const UptimeStateSchema = new Schema({
    date: {type: Date, required: true},
    statusCode: {type: Number, required: true},
    responseTime: {type: Number, required: true}
});

const UptimeState = mongoose.model<IUptimeState>('User', UptimeStateSchema);
export default UptimeState;

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
