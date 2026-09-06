require("dotenv").config();
const app = require("../src/app");
const connectDb=require("./config/db");

connectDb()

app.get("/", (req, res) => {
    res.send("Server is working!");
});
 
app.listen(3000, () => {
    console.log("Running at 3k");
}); 