const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config");
const {Account} = require("../db");
const  { authMiddleware } = require("../middleware");
const { default: mongoose } = require("mongoose");

const router = express.Router();
const app = express();

const accountequest = zod.object({
    to: zod.string(),
    amount: zod.number(),
})

router.get("balance", authMiddleware, async (req,res)=>{
    const account = await Account.findOne({
        userId: req.userId
    });

    res.status(200).json({
        balance: account.balance
    })
})

router.post("transfer", authMiddleware, async (req, res)=>{
    const session = await mongoose.startSession();
    session.startTransaction();

    const body = req.body;
    const account = await Account.findOne({ userId: req.userId }).session(session);

    if (!account || account.balance < body.amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }

    const toAccount = await Account.findOne({ userId: body.to }).session(session);

    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }

    // Perform the transfer
    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    // Commit the transaction
    await session.commitTransaction();
    res.json({
        message: "Transfer successful"
    });

});

module.exports = router;