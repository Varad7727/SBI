const mongoose = require("mongoose");
const ledgerModel = require("../models/ledger.model");

const accountSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: [true, "There Should Be Associated User.."],
            index: true,
        },

        status: {
            type: String,
            enum: {
                values: ["ACTIVE", "INACTIVE", "FROZEN"],
                message: "Above Values only"
            },
            default: "ACTIVE",
        },

        currency: {
            type: String,
            required: [true, "Currency Required!!"],
            default: "INR"
        },
    },
    { timestamps: true }
);

accountSchema.index({ user: 1, status: 1 });

accountSchema.methods.getBalance = async function () {

    const balanceData = await ledgerModel.aggregate([
        {
            $match: {
                account: this._id
            }
        },

        {
            $group: {
                _id: null,

                totalDebit: {
                    $sum: {
                        $cond: [
                            { $eq: ["$type", "DEBIT"] },
                            "$amount",
                            0
                        ]
                    }
                },

                totalCredit: {
                    $sum: {
                        $cond: [
                            { $eq: ["$type", "CREDIT"] },
                            "$amount",
                            0
                        ]
                    }
                }
            }
        },

        {
           $project: {
    _id: 0,
    balance: {
        $subtract: [
            "$totalCredit",
            "$totalDebit"
        ]
    }
}
        }
    ]);

    // If account has no ledger entries
    if (balanceData.length === 0) {
        return 0;
    }

    return balanceData[0].balance;
};

// Find only those ledger documents
// where account === this account's _id

const accountModel = mongoose.model("account", accountSchema);

module.exports = accountModel;