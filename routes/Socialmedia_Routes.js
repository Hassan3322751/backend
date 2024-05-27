import express from 'express';
import User from '../models/user.js'
import jwt from "jsonwebtoken"
import ChannelInfo from '../models/socialMedia.js'
import InstaProfileInfo from '../models/InstaProfInfo.js'
import tiktokProfileInfo from '../models/TiktokProfInfo.js'
import authenticateUser from '../middlewares/userAuth.js';

const router = express.Router();

router.post("/saveYoutubeInfo", async (req, res) => {
  try {
      const { token } = req.cookies;

      if (token) {
          const userId = jwt.verify(token, "aduyauihdjjhiodohsdhn8qwe8989wersod");
          const user = await User.findById(userId).populate('channelInfo');
          const data = req.body;
          
          // Check if the channel already exists for the user
          const existingChannel = await ChannelInfo.findOne({
              userId: userId,
              id: data.id,
              channelName: data.channelName
          });

          if (existingChannel) {
            user.channelInfo = existingChannel;
            await user.save();
            return res.status(200).json({ success: true, message: 'Channel already exists for this user' });
          }

          const channelData = { ...data, userId: userId, coins: "10" };
          const channelInfo = new ChannelInfo(channelData);
          await channelInfo.save();


          user.channelInfo = channelInfo;
          await user.save();

          res.status(200).json({ success: true, message: 'Channel info saved and associated with the user successfully' });
      } else {
          res.status(401).json({ success: false, message: 'User not authenticated' });
      }
  } catch (error) {
      console.error('Error saving channel info:', error);
      res.status(500).json({ success: false, message: 'Failed to save channel info' });
  }
});



router.get('/getChannelInfo', authenticateUser, async (req, res) => {
  const { userData, channelInfo } = req.user;
  
    try {
      if (channelInfo) {
        return res.status(200).json({ success: true, message: channelInfo });
      } else {
        return res.status(404).json({ success: false, message: 'No channel info found for this user' });
      }
    } catch (error) {
      console.error('Error fetching channel info:', error);
      return res.status(500).json({ success: false, message: 'Failed to retrieve channel info' });
    }
})  
  
router.get('/getInstaProfInfo', authenticateUser, async (req, res) => {
    const { InstaProfInfo } = req.user;
    try {
        if (InstaProfInfo) {
        return res.status(200).json({ success: true, message: InstaProfInfo});
        } else {
        return res.status(404).json({ success: false, message: 'No Insta Profile info found for this user' });
        }
    } catch (error) {
        console.error('Error fetching channel info:', error);
        return res.status(500).json({ success: false, message: 'Failed to retrieve Insta Profile info' });
    }
    
})  

router.post("/saveInstaProfInfo", authenticateUser, async (req, res) => {
    try {
      const { userData } = req.user;
      const data  = req.body.profileInfo;
      if (userData) {
        // Check if the channel already exists for the user
        const existingProfInfo = await InstaProfileInfo.findOne({
          userId: userData._id,
          id: data.id,
          userName: data.userName
        });
        
        if (existingProfInfo) {
              let currentProfInfo = existingProfInfo
              userData.instaProfInfo = currentProfInfo;
              await userData.save();
              return res.status(200).json({ success: false, message: `insta profile already exists : ${existingProfInfo}` });
            }
  
            const profileData = { ...data, userId: userData._id, coins: "10" };
            const profileInfo = new InstaProfileInfo(profileData);
            await profileInfo.save();
  
            userData.populate({
              path: 'instaProfInfo',
              options: { strictPopulate: false },
            });
  
            userData.instaProfInfo = profileInfo;
            await userData.save();
  
            res.status(200).json({ success: true, message: 'Insta profile info saved and associated with the user successfully' });
        } else {
            res.status(401).json({ success: false, message: 'User not authenticated' });
        }
    } catch (error) {
        console.error('Error saving channel info:', error);
        res.status(500).json({ success: false, message: 'Failed to save insta profile info' });
    }
  });

router.get('/getTiktokProfInfo', authenticateUser, async (req, res) => {
    const { tiktokProfInfo } = req.user;
    try {
        if (tiktokProfInfo) {
        return res.status(200).json({ success: true, message: tiktokProfInfo});
        } else {
        return res.status(404).json({ success: false, message: 'No Insta Profile info found for this user' });
        }
    } catch (error) {
        console.error('Error fetching channel info:', error);
        return res.status(500).json({ success: false, message: 'Failed to retrieve Insta Profile info' });
    }
    
})  

// router.get('/getTiktok', authenticateUser, async (req, res) => {
//     // const { tiktokProfInfo } = req.body;
//     const username = '@loganscandies';

//     TikTokScraper.getUserProfileInfo(username)
//       .then(user => {
//         console.log(user);
//       })
//       .catch(error => {
//         console.error(error);
//       });
//     })  

router.post("/saveTiktokProfInfo", authenticateUser, async (req, res) => {
    try {
      const { userData } = req.user;
      const data  = req.body.profileInfo;
      if (userData) {
        // Check if the channel already exists for the user
        const existingProfInfo = await tiktokProfileInfo.findOne({
          userId: userData._id,
          id: data.id,
          userName: data.userName
        });
        
        if (existingProfInfo) {
              let currentProfInfo = existingProfInfo
              userData.tiktokProfInfo = currentProfInfo;
              await userData.save();
              return res.status(200).json({ success: false, message: `insta profile already exists : ${existingProfInfo}` });
            }
  
            const profileData = { ...data, userId: userData._id, coins: "10" };
            const profileInfo = new tiktokProfileInfo(profileData);
            await profileInfo.save();
  
            userData.populate({
              path: 'tiktokProfInfo',
              options: { strictPopulate: false },
            });
  
            userData.tiktokProfInfo = profileInfo;
            await userData.save();
  
            res.status(200).json({ success: true, message: 'Insta profile info saved and associated with the user successfully' });
        } else {
            res.status(401).json({ success: false, message: 'User not authenticated' });
        }
    } catch (error) {
        console.error('Error saving channel info:', error);
        res.status(500).json({ success: false, message: 'Failed to save insta profile info' });
    }
  });
  

export default router;