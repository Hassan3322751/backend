import mongoose from "mongoose";

const channelInfoSchema = new mongoose.Schema({
    id: String,
    userId: String,
    channelName: String,
    thumbnail: String,
    coins: Number,
    dailyBonus: { type: mongoose.Schema.Types.ObjectId, ref: 'DailyBonus' },
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
  const ChannelInfo =  mongoose.model('ChannelInfo', channelInfoSchema);

export default ChannelInfo