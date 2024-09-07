const express = require("express");


const userRouter = require("./user");
//mongodb+srv://admin:VbmCBFTByiVJGAUl@cluster0.rkvlplz.mongodb.net/
const router = express.Router();
router.use("/user", userRouter);

module.exports = router;

