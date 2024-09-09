const express = require("express");

//all routers
const userRouter = require("./user");
const accountRouter = require("./account");

const router = express.Router();
router.use("/user", userRouter);
router.use("/account", accountRouter);

module.exports = router;

