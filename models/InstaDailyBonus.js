import mongoose from "mongoose";

const InstadailyBonusSchema = new mongoose.Schema({
  instaProfInfo: { type: mongoose.Schema.Types.ObjectId, ref: 'InstaProfileInfo', required: true, unique: true },
  bonusCredits: { type: Number, default: 25 },
  dailyActionsCompleted: { type: Number, default: 0 },
  isClaimed: { type: Boolean, default: false },
  nextResetTime: { type: Date, default: () => new Date().getTime() + 24 * 60 * 60 * 1000 },
});

const InstaDailyBonus = mongoose.model('InstaDailyBonus', InstadailyBonusSchema);
export default InstaDailyBonus