const express=require("express");

const cookieParser=require("cookie-parser");
const app=express();

app.use(express.json());
app.use(cookieParser());

/*
ROUTES
*/
const authRouter=require("../src/routes/auth.routes");
const accountRouter=require("../src/routes/account.router");
const transactionRouter=require("../src/routes/transaction.router");

console.log("AUTH ROUTER:", typeof authRouter);
console.log("ACCOUNT ROUTER:", typeof accountRouter);
console.log("TRANSACTION ROUTER:", typeof transactionRouter);

/*
USE ROUTES
*/
app.use("/api/auth",authRouter);
app.use("/api/accounts",accountRouter);
app.use("/api/transactions",transactionRouter);
module.exports=app;