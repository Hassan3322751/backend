import express from 'express';
import authenticateUser from '../middlewares/userAuth.js';
import getPlat_ModelData from '../middlewares/userProfModPicker.js';

const router = express.Router();

router.post("/addPromotion", authenticateUser, async (req, res) => {
    try {
        const {promotionData, platformType} = req.body;
        const data = promotionData;
        console.log(promotionData)

        const { profileData } = getPlat_ModelData(req, platformType);
        let profile = profileData;
      
        const existingPromotion = profile.promotions.find(
          (promo) => promo.targetLink === data.targetLink
        );
  
        if (existingPromotion) {
          return res.status(400).json({ success: false, message: 'User already has a promotion of this type video' });
        } else{
          profile.promotions.push({
            targetLink: data.targetLink,
            promotionType: data.promotionType,
            quantity: data.quantity,
            remainingQuantity: data.quantity,
            isCompleted: false,
            coinsRequired: data.requiredCoins,
          });

          profile.coins -= data.requiredCoins;
    
          await profile.save();
        }
  
        return res.status(200).json({ success: true, message: 'Promotion added successfully' });
      } 
       catch (error) {
          console.error('Error adding promotion:', error);
          return res.status(500).json({ success: false, message: 'Failed to add promotion' });
    }
  });
  
  router.get('/getPromotions', authenticateUser, async (req, res) => {
    const { userData } = req.user;
    const { platformType } = req.query || 'default';
    const { profileModel  } = getPlat_ModelData(req, platformType);
  
    const accountModel = profileModel;
  
    if (!accountModel) {
      return res.status(400).json({ success: false, message: 'Invalid platformType' });
    }
  
    accountModel.find({}, 'promotions')
      .then((results) => {
        const allPromotions = [];
  
        if (results && results.length > 0) {
          results.forEach((result, index) => {
            const promotions = result.promotions;
            if (promotions) {
              allPromotions.push(...promotions.flat());
            }
          });
        }
  
        res.status(200).json({ success: true, promotions: allPromotions, donePromotions: userData.donePromos });
      })
      .catch((err) => {
        console.error('Error retrieving promotions:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      });
  });

  router.post('/jobResult', authenticateUser, async (req, res)=>{
    const { userData } = req.user;
    const { success, donePromotionId, promoType } = req.body;
    const { platformType } = req.query || 'default';

    const { profileData, profileName, profileModel, bonusModel } = getPlat_ModelData(req, platformType);
    const accountModel = profileModel;  // Use profileModel as accountMode
    const dailyBonusCard = bonusModel;

    if (!accountModel) {
      return res.status(400).json({ success: false, message: 'Invalid platformType Model not found' });
    }
    
    const allPromotions = await accountModel.find({}).populate('promotions');
    const flattenedPromotions = allPromotions.flatMap((info) => info.promotions);
    
    const foundPromotion = flattenedPromotions.find( //Promotion to update remaining quantity 
    (promotion) => promotion._id.toString() === donePromotionId
    );

    if (!foundPromotion) {
      return res.status(400).json({ success: false, message: 'No promotion found' });
    }

    userData.donePromos.push(donePromotionId);
    const donePromoId = userData.donePromos;
    
    if(success){      
      const { remainingQuantity } = foundPromotion;
      if(remainingQuantity > 0){
        foundPromotion.remainingQuantity -= 1;
      } 
      if(foundPromotion.remainingQuantity === 0) {
        foundPromotion.isCompleted = true; 
      }
      
      if(promoType === 'likes' || promoType === 'like'){
        profileData.coins += 1;
      } else{
        profileData.coins += 2;
      }
      
      const dailyBonus = await dailyBonusCard.findOne({ [profileName]: profileData._id });

      if (!dailyBonus) {
        // If dailyBonus is null, create a new entry
        const newDailyBonus = new dailyBonusCard({
          [profileName]: profileData._id,
          bonusCredits: 25,
          dailyActionsCompleted: 1, // Assuming the user completed a daily action
          nextResetTime: new Date().getTime() + 24 * 60 * 60 * 1000,
        });
        profileData.dailyBonus = newDailyBonus._id;

        await newDailyBonus.save();
        await profileData.save();
      } else {
        // Check if daily actions completed count reaches the threshold
        if (dailyBonus.dailyActionsCompleted >= 10) {
          // Reset the count and update next reset time
          dailyBonus.nextResetTime = new Date().getTime() + 24 * 60 * 60 * 1000;
        }else{
          dailyBonus.dailyActionsCompleted += 1;
        }
        await dailyBonus.save();
      }
    }
    
    const parentDocument = foundPromotion.parent();
    await parentDocument.save();
    await profileData.save();
    await userData.save();              

    res.status(200).json({success: true, message: 'successfull'})
    
  })
  
  export default router