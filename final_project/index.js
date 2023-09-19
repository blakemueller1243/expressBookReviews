const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

// const secretKey = 'super_duper_secret_key';

app.use(express.json());


app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}));


// app.use("/customer/auth/*", function auth(req,res,next){
//     const token = req.header('Authorization');

//     if(!token) {
//         return res.status(401).json({ message: "You must be signed in to do that." });
//     }

//     jwt.verify(token, secretKey, (err, decoded) => {
//         if (err) {
//             console.log(err);
//             return res.status(401).json({ message: "Token missing/Not Signed In" });
//         }
//         req.user = decoded;
//         next();
//     });
// });
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
