const mongoose = require("mongoose");

async function connectDb() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB connected!!");
    } catch (error) {
        console.error("MongoDB Connection failed:", error.message);
    }
}
module.exports = connectDb;