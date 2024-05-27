import mongoose from "mongoose";

const tiktokDailyBonusSchema = new mongoose.Schema({
  tiktokProfInfo: { type: mongoose.Schema.Types.ObjectId, ref: 'tiktokProfileInfo', required: true, unique: true },
  bonusCredits: { type: Number, default: 25 },
  dailyActionsCompleted: { type: Number, default: 0 },
  isClaimed: { type: Boolean, default: false },
  nextResetTime: { type: Date, default: () => new Date().getTime() + 24 * 60 * 60 * 1000 },
});

const tiktokDailyBonus = mongoose.model('tiktokDailyBonus', tiktokDailyBonusSchema);
export default tiktokDailyBonus