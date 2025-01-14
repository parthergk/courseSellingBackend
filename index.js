const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoutes");
const app = express();
const port = 3000 || process.env.PORT

app.use('/api/user', userRoute);


async function main() {
    await mongoose.connect(process.env.DB_URI);
    app.use(port,()=>{
        console.log("server is running on https://localhost:3000");
    })
}
main();