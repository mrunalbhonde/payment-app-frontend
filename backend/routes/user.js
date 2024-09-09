const express = require("express");
const zod = require("zod");
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const  { authMiddleware } = require("../middleware");

const router = express.Router();
const app = express();

// import userMiddleware from "./middleware/userMiddleware"

const signupSchema = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string(),
});

const signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string()
});

const updateSchema = zod.object({
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
    password: zod.string().optional(),
});

app.post("/signup", async(req,res)=>{
    const body = req.body;
    //we made schema as object so no need to separately take out username password etc
    const {success} = signupSchema.safeParse(body);
    if(!success){
        return res.status(411).json({
            message: "Email already taken/ Incorrect inputs"
        });
    }

    const userCheck = await User.findOne({
        username: body.username
    })
    
    if (userCheck && userCheck._id) {
        return res.status(411).json({
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
    const token = jwt.sign({userId}, JWT_SECRET);
    
    res.status(200).json({
        message: "User created successfully",
        token
    });
});

app.post("/signin", async(req,res)=>{
    const body = req.body;

    const success = signinSchema.safeParse(body);
    if(!success.success){
        res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: body.username,
        password: body.password
    })

    const userId = user._id;
    const token = jwt.sign({userId}, JWT_SECRET);

    if (user) {
        return res.status(200).json({
            token: token,
        })
    } else {
        return res.status(411).json({
            message: "Error while logging in"
        })
    }
})

app.put("/", async (req, authMiddleware, res) => {
    const body = req.body;
    const {success} = updateSchema.safeParse(body);

    if(!success){
        res.status(411).json({
            message: "Error while updating the information",
        })
    }

    await User.updateOne({ _id: body.userId }, body);

    res.status(200).json({
        message: "Updated successfully"
    })

})

app.get("/bulk", async(req,res)=>{
    const filter = req.query.filter;

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})


module.exports = router;