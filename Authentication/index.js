import express, { Router } from "express";
import dotenv from "dotenv";
import {connectDB} from "./src/condig/db.js";
import router from "./src/router/user.route.js";
// import passport from "./src/condig/passport.js"
import session from "express-session";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 6000;
 
app.use(express.json());

app.use(session({ secret: "session_secret", resave: false, saveUninitialized: false }));
// app.use(passport.initialize());
// app.use(passport.session());


app.use("/auth", router);

await connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});