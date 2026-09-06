const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "From Account Required!!"],
        index: true
    },
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "To Account Required!!"],
        index: true
    },
    status: {
        type: String,
        enum: {
            values: ["COMPLETED", "FAILED", "PENDING", "REVERSED"],
            message: "Status Should Be Above Values Only!!",
        },
        default: "PENDING",
    },
    amount: {
        type: Number,
        required: [true, "Amount Required!!"],
        min: [1, "Amount Should Be Greater Than 0!!"]
    },
    idempotencyKey: {
        type: String,
        required: [true, "Idempotency Key Required!!"],
        index: true,
        unique: true,
    },
}, {
    timestamps: true
})

const transactionModel = mongoose.model("transaction", transactionSchema)
module.exports = transactionModel

//idempotencyKey stops double transaction in case of network failure or any other issue. It ensures that the same transaction is not processed multiple times. 