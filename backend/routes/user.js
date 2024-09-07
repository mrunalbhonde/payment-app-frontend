const express = require("express");
const zod = require("zod");
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

const router = express.Router();
const app = express();

// import userMiddleware from "./middleware/userMiddleware"

const signupSchema = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string(),
});

app.post("/signup", async(req,res)=>{
    const body = req.body;
    //we made schema as object so no need to separately take out username password etc
    const success = signupSchema.safeParse(body);
    if(!success){
        return res.json({
            message: "Email already taken/ Incorrect inputs"
        }).status(411);
    }

    const userCheck = User.findOne({
        username: body.username
    })
    
    if (userCheck._id) {
        return res.json({
            message: "Email already taken/ Incorrect inputs"
        })
    }
    
    //can add specif zod conditions
    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })
    
    const userId = user._id;
    const token = jwt.sign(userId, JWT_SECRET);
    
    res.json({
        message: "User created successfully",
        token
    }).status(200);
});



module.exports = router;