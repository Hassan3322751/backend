import express from 'express';
import authenticateUser from '../middlewares/userAuth.js';
import getPlat_ModelData from '../middlewares/userProfModPicker.js';

const router = express.Router();

router.get("/dailyBonus", authenticateUser, async (req, res) => {
    const { platformType } = req.query || 'default';
    const { profileData, profileName, bonusModel } = getPlat_ModelData(req, platformType);
    try {
      // Find the DailyBonus data based on the channelId
      const dailyBonus = await bonusModel.findOne({ [profileName]: profileData._id });

      if (!dailyBonus) {
        return res.status(404).json({ success: false, message: 'DailyBonus data not found' });
      }

        res.status(200).json({ success: true, message: dailyBonus });
      } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
  });

router.post("/dailyReward", authenticateUser, async (req, res) => {
    const { platformType } = req.query || 'default';
    const { profileData, profileName, bonusModel } = getPlat_ModelData(req, platformType);
    try {
        // Find the DailyBonus data based on the channelId
        const dailyBonus = await bonusModel.findOne({ [profileName]: profileData._id });

        if (dailyBonus.dailyActionsCompleted >= 25 && dailyBonus.isClaimed === false) {
          // Update channelInfo coins and add 20 coins if infoNumber is 25
          dailyBonus.isClaimed = true;
          profileData.coins += 30;
          await dailyBonus.save();
          await profileData.save();
        } else {
          return res.status(404).json({ success: false, message: 'DailyBonus claimed already' });
        }
        res.status(200).json({ success: true, message: profileData });
      } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
  });

export default router