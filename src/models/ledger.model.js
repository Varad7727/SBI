const mongoose = require("mongoose")

const ledgerSchema = new mongoose.Schema({
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"Ledger must Be Assosciated With Account!!"],
        index:true,
        immutable:true,
    },
    transaction:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"transaction",
        required:[true,"Ledger must Be Assosciated With Transaction!!"],
        index:true,
        immutable:true,
    },
    amount:{
        type:Number,
        required:[true,"Ledger Must Have Amount!!"],
        immutable:true,
    },
    type:{
        type:String,
        enum:{
            values:["CREDIT","DEBIT"],
            message:"Ledger Type Should Be Above Values Only!!"
        },
        required:[true,"Ledger Must Have Type!!"],
        immutable:true,
    },
})

const preventModification=()=>{
    throw new Error("Ledger Cannot Be Modified!!")
}
//cant update or delete ledger as it is a record of transaction and should be immutable.
ledgerSchema.pre("findOneAndUpdate",preventModification)
ledgerSchema.pre("updateOne",preventModification)
ledgerSchema.pre("updateMany",preventModification)
ledgerSchema.pre("update",preventModification)
ledgerSchema.pre("deleteOne",preventModification)
ledgerSchema.pre("deleteMany",preventModification)
ledgerSchema.pre("findOneAndDelete", preventModification);
ledgerSchema.pre("replaceOne", preventModification);

const ledgerModel=mongoose.model("ledger",ledgerSchema)
module.exports=ledgerModel
