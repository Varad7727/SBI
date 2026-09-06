const express = require("express");
const authMiddleware = require("../middleware/auth.middleware")
const createAccountController = require("../controller/account.controller")
const router = express.Router();

/*
POST- /api/accounts/
create new account
*/

router.post("/", authMiddleware.authMiddleware, createAccountController.createAccountController)

/*
GET /api/accounts/
get all accounts of user
*/
router.get("/", authMiddleware.authMiddleware, createAccountController.getUserAccountsController)

/*
GET /api/accounts/:accountId
get account by id
*/
router.get("/balance/:accountId", authMiddleware.authMiddleware, createAccountController.getAccountBalanceController)
module.exports = router;