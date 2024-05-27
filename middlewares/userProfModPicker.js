import ChannelInfo from '../models/socialMedia.js';
import InstaProfileInfo from '../models/InstaProfInfo.js';
import tiktokProfileInfo from '../models/TiktokProfInfo.js';
import DailyBonus from '../models/DailyBonus.js';
import InstaDailyBonus from '../models/InstaDailyBonus.js';
import tiktokDailyBonus from '../models/TiktokDailyBonus.js';

const getPlat_ModelData = (req, platformType) => {
    let userInfo = req.user;
    const {channelInfo, InstaProfInfo, tiktokProfInfo} = userInfo;
    
    switch (platformType) {
      case 'instagram':
        return { profileData: InstaProfInfo, profileName: 'instaProfInfo', profileModel: InstaProfileInfo, bonusModel: InstaDailyBonus };
      case 'tiktok':
        return { profileData: tiktokProfInfo, profileName: 'tiktokProfInfo', profileModel: tiktokProfileInfo, bonusModel: tiktokDailyBonus };
      case 'youtube':
        return { profileData: channelInfo, profileName: 'channelInfo', profileModel: ChannelInfo, bonusModel: DailyBonus };
      default:
        return null; // Handle the default case
    }
  };
  
  export default getPlat_ModelData;