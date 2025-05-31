import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    organization: {
        type: String,
        require: true
    },
    phone: {
        type: Number,
    },
    lastlogin: {
        type: Date,
        default: Date.now,
    },
},{
    timestamps: true,
});

const User = mongoose.model("User",userSchema);


export default User;