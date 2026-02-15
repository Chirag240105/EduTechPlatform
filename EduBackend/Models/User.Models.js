import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userScheme = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
        minlength: 4
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lower: true,
        trim: true
    },
    password:{
        type: String,
        minlength: 8,
        required: true,
    }
}, {timestamps: true})

userScheme.pre('save',async function (){
    if(!this.isModified('password')) return ;
    this.password = await bcrypt.hash(this.password, 12);
    
})
userScheme.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

export const User = mongoose.model("User", userScheme);