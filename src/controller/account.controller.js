const accountModel = require("../models/account.model");

const createAccountController = async (req, res) => {
  //store user
  //auth.middle
  const user = req.user;
  //create account Get the currently logged-in user's information.

  const account = await accountModel.create({
    user: user._id
  })

  res.status(201).json({
    account
  })
}

const getUserAccountsController = async (req, res) => {
  const accounts = await accountModel.find({ user: req.user._id })
  res.status(200).json({
    accounts
  })
}
const getAccountBalanceController = async (req, res) => {
    try {
        const { accountId } = req.params;

        const account = await accountModel.findOne({
            _id: accountId,
            user: req.user._id
        });

        if (!account) {
            return res.status(404).json({
                message: "Account Not Found!!"
            });
        }

        const balance = await account.getBalance();

        return res.status(200).json({
            accountId: account._id,
            balance
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Failed to fetch balance",
            error: error.message
        });
    }
};
module.exports = {
  createAccountController,
  getUserAccountsController, getAccountBalanceController
}
