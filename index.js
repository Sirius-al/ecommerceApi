const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const userRoute = require("./routes/user");
const authRoutes = require("./routes/auth");
const productRoute = require("./routes/product");
const orderRoute = require("./routes/order");
const cartRoute = require("./routes/cart");

dotenv.config();

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connected to database");
    })
    .catch((err) => {
        console.log(err);
    });

app.use(express.json());

app.use("/api/users", userRoute);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);
// app.use("/api/cart", cart);

app.listen(process.env.PORT || 5000, () => {
    console.log("server is running on port 5000");
});
