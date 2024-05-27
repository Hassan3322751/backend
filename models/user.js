import mongoose, { SchemaType } from "mongoose";
const Schema = mongoose.Schema;
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
      donePromos: [
      {
        type: Schema.Types.String,
      }
    ],
      refrrals: [
      {
        userId: Schema.Types.String,
        Name: Schema.Types.String
      }
    ],
      refrringLink: [
      {
        type: Schema.Types.String,
      }
    ],
      refrredBy: [
      {
        type: Schema.Types.String,
      }
    ],
      channelInfo: [
      {
        type: Schema.Types.ObjectId,
        ref: 'ChannelInfo',
      },
    ],
      instaProfInfo: [
      {
        type: Schema.Types.ObjectId,
        ref: 'InstaProfileInfo',
      },
    ],
      tiktokProfInfo: [
      {
        type: Schema.Types.ObjectId,
        ref: 'tiktokProfileInfo',
      },
    ],
});
const User = mongoose.model("User", userSchema);

export default User; 