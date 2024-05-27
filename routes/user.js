import express from 'express';
import User from '../models/user.js'
import jwt from "jsonwebtoken"
import { encrypt, decrypt } from '../middlewares/Encrypt_Decrypt.js';

const router = express.Router();

router.get("/isAuthenticated", async (req,res) => {
    const { token } = req.cookies;

    if (token) {
        const userId = jwt.verify(token, "aduyauihdjjhiodohsdhn8qwe8989wersod");
        const userData = await User.findById(userId)
        console.log(userData)
        return res.status(200).json(
            {success: true, message: userData}
        )
        }
})

router.post("/login", async (req, res) => {
   const { email, password } = req.body;

    let user = await User.findOne({email})
    if(!user){  
    return res.status(400).json(
        {success: false, message:"User not exist, Please Signup"}
    )}
    else {
        if(password === user.password){
            console.log("signed in successfully");  
            const token = jwt.sign({_id: user._id}, "aduyauihdjjhiodohsdhn8qwe8989wersod")
            
            // res.cookie("token", token, ({ httpOnly: true }) );
            res.cookie("token", token, {  });
            
            return res.status(200).json({
                success: true,
            });
        } else if(password !== user.password) {
            return res.status(401).json(
               {success: false, message:"Invalid Password"}
            )
        }
      }
   });

router.post("/register", async (req, res) => {
    const { name, email, password, referredBy } = req.body;
    let user = await User.findOne({ email });
    let refByUD;
    
    if (user) {
        console.log("User already exists");
        return res.status(400).json({ success: false, message: "User already exists" });
    } 
    else if (referredBy === null || referredBy === '' || referredBy === undefined){
        try {
            // let encryptedPassword = encrypt(password)
            // Assuming this is where you create the user
            user = await User.create({
                name,
                email,
                password,
                // password: encryptedPassword,
            });

            const encryptedHashedId = encrypt(`${user._id}`);
            user.refrringLink = `http://localhost:3000/register?refrralCode=${encryptedHashedId}`;

            await user.save();

            res.status(201).json({ success: true, message: "Registration successful without referral" });
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(401).json({ success: false, message: "Error whole creating user without referral" });
        }
    } 
    else {
        try {
            // let encryptedPassword = encrypt(password);
            const decryptedHashedId = decrypt(referredBy);
            refByUD = await User.findById(decryptedHashedId);
            try {
                // Assuming this is where you create the user
                user = await User.create({
                    name,
                    email,
                    password,
                    refrredBy: refByUD._id, 
                    // password: encryptedPassword,
                });

                const encryptedHashedId = encrypt(`${user._id}`);
                user.refrringLink = `http://localhost:3000/register?refrralCode=${encryptedHashedId}`;
                
                refByUD.refrrals.push({Name: user.name});
                await refByUD.save();
                await user.save();

                res.status(201).json({ success: true, message: "Registration successful with referral" });
            } catch (error) {
                console.error("Error creating user:", error);
                return res.status(401).json({ success: false, message: "Error while creating user with referral" });
            }
            
        } catch (error) {
            return res.status(401).json({ success: false, message: "Please use valid referral or remove it" });
        }
    }
}) 

export default router;