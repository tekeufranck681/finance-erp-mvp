import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";





export const signup = async(req,res) => {
    const {email,password,name,organization,phone} = req.body;

    try{
        if(!email || !password || !name || !organization || !phone ){
            return res.status(400).json({success: false, message:"All fields are required"});
        }
        const isUser = await User.findOne({email: email});
        if(isUser){
            return res.status(400).json({success: false, message: " User already exists"});
        }
        const hashPassword = await bcryptjs.hash(password,10);
      
        const user = new User({
            email,password: hashPassword,name,organization,phone
        });
        await user.save();
        generateTokenAndSetCookie(res,user._id);
        res.status(201).json({success: true, message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        });

    }catch(error){
         console.log("Error during registration", error.message);
         res.status(500).json({ success: false, message: "Internal Server Error"});
    }
}

export const login = async(req,res) => {
        const {email,password} = req.body;
    
            try {
                const user = await User.findOne({email});
                if(!user){
                    return res.status(400).json({success: false, message: "Invalid email"});
                }
                if(!password){
                    return res.status(400).json({success: false, message: "Password required"});
                }
                const isPasswordValid =  bcryptjs.compare(password,user.password);
            
                if(!isPasswordValid){
                    return res.status(400).json({success: false, message: "Incorrect password"});
                }
                generateTokenAndSetCookie(res,user._id);
                user.lastlogin = new Date();
                await user.save();
                res.status(200).json({
                    success: true,
                    message: "Login successful",
                    user: {
                        ...user._doc,
                        password: undefined,
                        }
                });
            } catch (error) {
                console.log("Error in login",error.message);
                res.status(400).json({success: false, message: error.message});
            }        

}

export const logout = async(req,res) => {
    res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
    res.status(200).json({success:true, message: "Logged out successfully"});

}

export const checkAuth = async(req,res) =>{
    const userId = req.userId;
    try {
        const user = await User.findById(userId).select("-password");
        if(!user){
            return res.status(400).json({success: false,message: "User not found"});
        }
        res.status(200).json({success: true, user: user});
    } catch (error) {
        console.log("Error during Authentication", error.message);
        res.status(400).json({success: false, message: "Error during Authentication"});
    }
}