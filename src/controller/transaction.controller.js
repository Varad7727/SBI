// Create a new transaction
// *THE 10-STEP TRANSFER FLOW:
// 1. Validate request
// 2. Validate idempotency key
// *3. Check account status
// * 4. Derive sender balance from Ledger
// 5. Create transaction (PENDING)
// *6. Create DEBIT Ledger entry
// 7. Create CREDIT ledger entry
// 8. Mark transaction COMPLETED
// 9. Commit MongoDB session
// 10. Send email notification
// All destructured elements are unused
const accountModel = require("../models/account.model");
const ledgerModel = require("../models/ledger.model");
const transactionModel = require("../models/transaction.model");
const emailService = require("../services/email.service");
const mongoose = require("mongoose")
const createTransaction = async (req, res) => {

    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

    // 1. Validate request
    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "FromAccount, ToAccount, Amount and IdempotencyKey are required!!"
        });
    }

    // 2. Check accounts
    const fromUserAccount = await accountModel.findById(fromAccount);
    const toUserAccount = await accountModel.findById(toAccount);

    if (!fromUserAccount || !toUserAccount) {
        return res.status(404).json({
            message: "FromAccount or ToAccount Not Found!!"
        });
    }

    // 3. Idempotency check
    const isTransactionExist =
        await transactionModel.findOne({ idempotencyKey });

    if (isTransactionExist) {

        if (isTransactionExist.status === "COMPLETED") {
            return res.status(409).json({
                message: "Transaction with same idempotency key already exists!!",
                transactionId: isTransactionExist._id
            });
        }

        if (isTransactionExist.status === "PENDING") {
            return res.status(409).json({
                message: "PENDING TRANSACTION"
            });
        }

        if (isTransactionExist.status === "FAILED") {
            return res.status(409).json({
                message: "FAILED TRANSACTION"
            });
        }

        if (isTransactionExist.status === "REVERSED") {
            return res.status(409).json({
                message: "REVERSED TRANSACTION"
            });
        }
    }

    // 4. Check account status
    if (
        fromUserAccount.status !== "ACTIVE" ||
        toUserAccount.status !== "ACTIVE"
    ) {
        return res.status(400).json({
            message: "FromAccount or ToAccount is not ACTIVE!!"
        });
    }

    // 5. Check balance
    const balance = await fromUserAccount.getBalance();

    if (balance < amount) {
        return res.status(400).json({
            message: `Insufficient balance. Current balance is ${balance} and requested amount is ${amount}`
        });
    }

    // 6. Start session
    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        // 7. Create transaction
        const [transaction] = await transactionModel.create(
            [{
                fromAccount,
                toAccount,
                amount,
                idempotencyKey,
                status: "PENDING"
            }],
            { session }
        );

        // 8. DEBIT sender
        await ledgerModel.create(
            [{
                account: fromAccount,
                amount,
                transaction: transaction._id,
                type: "DEBIT"
            }],
            { session }
        );

        // 9. CREDIT receiver
        await ledgerModel.create(
            [{
                account: toAccount,
                amount,
                transaction: transaction._id,
                type: "CREDIT"
            }],
            { session }
        );

        // 10. Complete transaction
        transaction.status = "COMPLETED";

        await transaction.save({ session });

        // 11. Commit
        await session.commitTransaction();

        return res.status(200).json({
            message: "Transaction completed",
            transactionId: transaction._id
        });

    } catch (error) {

        await session.abortTransaction();

        console.error("Transaction Error:", error);

        return res.status(500).json({
            message: "Transaction Failed",
            error: error.message
        });

    } finally {
        await session.endSession();
    }
};


const createInitialFundsTransaction = async (req, res) => {
      console.log("🔥 INITIAL FUNDS CONTROLLER CALLED");

    const { toAccount, amount, idempotencyKey } = req.body;

    // 1. Validate request
    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "ToAccount, Amount and IdempotencyKey are required!!"
        });
    }

    // 2. Find receiver account
    const toUserAccount = await accountModel.findById(toAccount);

    if (!toUserAccount) {
        return res.status(404).json({
            message: "ToAccount Not Found!!"
        });
    }

    // 3. Find system account
    const fromUserAccount = await accountModel.findOne({
        user: req.user._id
    });
    console.log("========== INITIAL FUNDS DEBUG ==========");
console.log("TO ACCOUNT:", toUserAccount?._id);
console.log("FROM ACCOUNT:", fromUserAccount?._id);
console.log("LOGGED USER:", req.user._id);
console.log("=========================================");

    if (!fromUserAccount) {
        return res.status(404).json({
            message: "System Account Not Found!!"
        });
    }

    // 4. Start MongoDB session
    const session = await mongoose.startSession();

    try {

        // 5. Start transaction
        session.startTransaction();

        // 6. Create transaction
        // create() with session returns an array
        const transaction = (await transactionModel.create([{
            fromAccount: fromUserAccount._id,
            toAccount: toUserAccount._id,
            amount,
            idempotencyKey,
            status: "PENDING"
        }], { session }))[0];


        // 7. Create DEBIT ledger entry
        await ledgerModel.create([{
            account: fromUserAccount._id,
            amount,
            transaction: transaction._id,
            type: "DEBIT"
        }], { session });


        // 8. Create CREDIT ledger entry
        await ledgerModel.create([{
            account: toUserAccount._id,
            amount,
            transaction: transaction._id,
            type: "CREDIT"
        }], { session });


        // 9. Mark transaction completed
        transaction.status = "COMPLETED";

        await transaction.save({ session });


        // 10. Commit transaction
        await session.commitTransaction();


        // 11. End session
        await session.endSession();


        // 12. Send email after successful transaction
        await emailService.sendTransactionEmail(
            toUserAccount.user.email,
            toUserAccount.user.name,
            amount,
            toAccount
        );


        // 13. Send response
        return res.status(200).json({
            message: "Initial Funds Transaction Completed"
        });

    } catch (error) {

        // Rollback everything if anything fails
        await session.abortTransaction();

        await session.endSession();

        console.error("Initial Funds Transaction Error:", error);

        return res.status(500).json({
            message: "Initial Funds Transaction Failed",
            error: error.message
        });
    }
};



module.exports = {
    createTransaction, createInitialFundsTransaction
}