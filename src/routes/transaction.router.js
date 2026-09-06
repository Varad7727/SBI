const express = require("express");
const authMiddleware=require("../middleware/auth.middleware");
const tansactionCotroller=require("../controller/transaction.controller")
const transactionModel=require("../models/transaction.model")
const ledgerModel=require("../models/ledger.model")
const emailService=require("../services/email.service");

const transactionRoutes=express.Router();

/*
-POST /api/transaction
-creat new transaction
*/
transactionRoutes.post("/",authMiddleware.authMiddleware,tansactionCotroller.createTransaction)

/*
POST- /api/transaction/system/initial-funds
create initial funds transaction from system account to user account
*/
transactionRoutes.post(
    "/system/initial-funds",
    (req, res, next) => {
        console.log("🔥 INITIAL FUNDS ROUTE HIT");
        next();
    },
    authMiddleware.authSystemUserMiddleware,
    tansactionCotroller.createInitialFundsTransaction
);
module.exports=transactionRoutes