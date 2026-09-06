const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const emailService = require("../services/email.service")

/*
user registeer controller
POST /api/auth/register
*/
const userRegisterController = async (req, res) => {
    const { email, password, name } = req.body;

    //check whether email exist or not
    const isExist = await userModel.findOne({
        email: email
    })
    if (isExist) {
        return res.status(422).json({
            message: "User Already Exist",
            status: "Failed"
        })
    }
    //create user
    const user = await userModel.create({
        email, password, name
    })
    //userId comes from the user object that you got earlier, usually after finding the user in MongoDB.
    //sign the token
    const token = jwt.sign({
        userId: user._id
    }, process.env.JWT_KEY, { expiresIn: "3d" })
    //save into cookies
    res.cookie("token", token);

    res.status(201).json({
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    })

    await emailService.sendRegistrationEmail(user.email,user.name);
}

//login
/*
user login controller
POST /api/auth/login
*/
const userLoginController = async (req, res) => {
    const { email, password } = req.body;

    //find user by the email
    const user = await userModel.findOne({ email }).select("+password");

    //if user not found
    if (!user) {
        return res.status(401).json({
            message: "User Not Found(email or password is invalid)!!",
            status: "Failed"
        })
    }

    //if found theen compare
    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
        return res.status(401).json({
            message: "User Not Found(email or password is invalid)!!",
            status: "Failed"
        })
    }

    const token = jwt.sign({
        userId: user._id
    }, process.env.JWT_KEY, { expiresIn: "3d" })
    //save into cookies
    res.cookie("token", token);

    res.status(200).json({
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    })

}


module.exports = {
    userRegisterController,
    userLoginController
}