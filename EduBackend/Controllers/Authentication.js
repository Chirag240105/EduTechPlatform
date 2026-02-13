import { User } from "../Models/User.Models.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const generateToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRETKEY, {expiresIn: '1h'});
}

export const signUp = async(req, res) =>{
    const {name, email, password} = req.body;
    if(!name || !email || !password){
        return res.status(400).json({message:"All fields are required"});
    }
    try{
        const user =await User.findOne({email})
        
        if(user){
            return res.status(400).json({
                success: false,
                error: user.email === email ? "Email already registered": "Username already taken",
                mesasge : "This email already exists",
                statusCode: 400,
            });

        }
        const NewUser = await User.create({
            name,
            email,
            password
        });
        const token = generateToken(NewUser._id)
        res.status(201).json({
            success: true,
            data:{
                id: NewUser._id,
                name: NewUser.name,
                email: NewUser.email,
                profileImage: user.profileImage,
                createdAt: NewUser.createdAt,
            },
            token,
            message: "Successfully Signed Up"

        })
    }catch(error){
        console.log("Estanblishing user error : ",error);
        return res.status(500).json({message : "Error in signup . Re-Try"})
    }
}
export const login = async(req, res) =>{
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(401).json({message:"All fields are required"});
    }
    try{
        const user =await User.findOne({email})
        if(!user){
            return res.status(402).json({mesasge : "Invalid Credentials"})
        }
        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(402).json({mesasge : "Invalid Credentials"})
        }

        res.status(201).json({
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage     
            },
            token : generateToken(user._id),
            message: "Successfully logged in"
        })
    }catch(error){
        console.log("Estanblishing user error : ",error);
        return res.status(500).json({message : "Error in login . Re-Try"})
    }
}
export const getInfo = async(req, res) =>{
    try{
        const user =await User.findById(req.user.id);
        if(!user){
            return res.status(404).json({message : "User not found"})
        }
        res.status(200).json({
            success: true,
            data:{
                id: user._id,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
            
        });
    }catch(error){
        console.log("Estanblishing user error : ",error);
        return res.status(500).json({message : "Error in getting user . Re-Try"})
    }
}
export const updateProfile = async(req, res) =>{
    try{
    const {name, email, profileImage} = req.body;
        const user = await User.findById(req.user._id)
        if(name) user.name = name;
        if(email) user.email = email;
        if(profileImage) user.profileImage = profileImage;
        await user.save();
        res.status(200).json({
            message: "Successfully updated",
            data:{
                id:user._id,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage,
            },
        })
    }catch(error){
        console.log("Error in updating user : ", error)
        return res.status(401).json({message: "Server error || ", error})
    }
}
export const changePassword = async(req, res) =>{
const {currentPassword, newPassword} = req.body;
if(!currentPassword || !newPassword){
    return res.status(400).json({
        success: false,
        error: "Please provide current and new password",
        statusCode: 400,

    })
}
try{
    const user = await User.findById(req.user._id).select('+password')
    const isMatch =await user.comparePassword(currentPassword);
    if(!isMatch){
        return res.status(401).json({
            success: false,
            error: 'Current password is incorrect',
            message: 'Current password is incorrect',
            statusCode: 401
        })
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({success: true,message: "Successfully changed the password"})
}catch(error){
    console.log("Error in updating error || ", error)
    return res.status(500).json({message: "Server error"})
}
}