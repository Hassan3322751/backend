import mongoose from "mongoose";

const InstaProfInfoSchema = new mongoose.Schema({
    id: String,
    userId: String,
    userName: String,
    thumbnail: String,
    coins: Number,
    dailyBonus: { type: mongoose.Schema.Types.ObjectId, ref: 'InstaDailyBonus' },
    promotions: [
      {
        targetLink: String,
        promotionType: String, // 'like' or 'subscribe'
        quantity: Number, // Coins required for the promotion
        remainingQuantity: Number, // Number of likes/subscribes available for promotion
        isCompleted: Boolean,
        coinsRequired: Number,
      },
    ],
  });
  const InstaProfileInfo =  mongoose.model('InstaProfileInfo', InstaProfInfoSchema);

export default InstaProfileInfo