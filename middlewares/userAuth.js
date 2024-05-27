import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import ChannelInfo from '../models/socialMedia.js'
import InstaProfileInfo from '../models/InstaProfInfo.js';
import tiktokProfileInfo from '../models/TiktokProfInfo.js';

const authenticateUser = async (req, res, next) => {
  const { token } = req.cookies;
  try {
    
    if (token) {
      const userId = jwt.verify(token, 'aduyauihdjjhiodohsdhn8qwe8989wersod');
      const userData = await User.findById(userId);
      if (userData) {
        const channelInfo = await ChannelInfo.findById(userData.channelInfo);
        const InstaProfInfo = await InstaProfileInfo.findById(userData.instaProfInfo);
        const tiktokProfInfo = await tiktokProfileInfo.findById(userData.tiktokProfInfo);
        
        const userInfo = {
          channelInfo,
          userData,
          InstaProfInfo,
          tiktokProfInfo
        }
        req.user = userInfo; // Attach the user data to the request object
        next(); // Continue to the next middleware or route handler
      } else {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }
    } else {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
  } catch (error) {
    console.error('Error authenticating user:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export default authenticateUser;