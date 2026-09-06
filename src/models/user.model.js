const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        lowercase: true,
        required: [true, "Email Is Required!!!"],
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid Format"],
        unique: [true, "Email Exist!!!"],
    },
    name: {
        type: String,
        required: [true, "Name Is Required For Creating Account!!!"],
    },
    password: {
        type: String,
        required: [true, "Password Is Required!!!"],
        minlength: [6, "Atleast six!!!"],
        select: false
    },
    systemUser:{
        type:Boolean,
        default:false,
        immutable:true,
        select:false 

    }
}, { timestamps: true })

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return 
    }
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash;
    return 
})

userSchema.methods.comparePassword = async function (password) {
    console.log(password,this.password)
    return await bcrypt.compare(password, this.password)
}

const userModel=mongoose.model("user",userSchema);
module.exports=userModel;