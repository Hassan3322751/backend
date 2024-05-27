import mongoose from "mongoose";

const dailyBonusSchema = new mongoose.Schema({
  channelInfo: { type: mongoose.Schema.Types.ObjectId, ref: 'ChannelInfo', required: true, unique: true },
  bonusCredits: { type: Number, default: 25 },
  dailyActionsCompleted: { type: Number, default: 0 },
  isClaimed: { type: Boolean, default: false },
  nextResetTime: { 
    type: Date, 
    default: () => {
      // Set the default reset time to the current date and time
      return new Date();
    } 
  } // Set the default reset time to the current date and time
});

const DailyBonus = mongoose.model('DailyBonus', dailyBonusSchema);
export default DailyBonus;


// import mongoose from "mongoose";

// const dailyBonusSchema = new mongoose.Schema({
//   channelInfo: { type: mongoose.Schema.Types.ObjectId, ref: 'ChannelInfo', required: true, unique: true },
//   bonusCredits: { type: Number, default: 25 },
//   dailyActionsCompleted: { type: Number, default: 0 },
//   isClaimed: { type: Boolean, default: false },
//   nextResetTime: { type: Date, default: () => new Date().getTime() + 24 * 60 * 60 * 1000 },
// });

// const DailyBonus = mongoose.model('DailyBonus', dailyBonusSchema);
// export default DailyBonus