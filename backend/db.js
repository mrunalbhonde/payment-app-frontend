// can add constraints to schema for a elegant solution
import mongoose from "mongoose";

mongoose.connect("mongodb+srv://admin:VbmCBFTByiVJGAUl@cluster0.rkvlplz.mongodb.net/paytm");

const userSchema = new mongoose.Schema({
    username: String,
    firstName: String,
    lastName: String,
    password: String,
});

const User = mongoose.model("User", userSchema);

module.exports = {
    User
}

