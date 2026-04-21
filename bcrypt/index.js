import express from "express"
const app = express();

import dotenv from "dotenv";
dotenv.config();

console.log(process.env.DATABASE_URL)



import bcrypt from "bcryptjs";
// salt
const salt = await bcrypt.genSalt(10);

// pepper

const pepper = "SECRET_KEY";

const password = "123456" + pepper;

const hashedpassword = await bcrypt.hash(password, salt);

// console.log("sat is "+salt);
// console.log("hashed is "+hashedpassword);

const password_2 = "123456" + pepper;

// password varifaction
const isMatch = await bcrypt.compare(password_2,hashedpassword);
// console.log(isMatch);



const port=8000;
app.listen(port, ()=>{
    console.log(`server is running on port: ${port}`)
});