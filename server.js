const express = require("express");

const loginRoutes = require("./routes/loginRoutes");
const cors = require("cors");


// const productRoutes = require("./routes/productRoutes");
// const cartRoutes = require("./routes/cartRoutes");

//const authenticate = require("./middleware/auth");
//const orderRoutes = require("./routes/orderRoutes");

const app = express();
app.use(cors());
app.use(express.json());//Add middleware that parses incoming JSON request bodies and converts them into JavaScript objects stored in req.body
app.use("/login-container-cdk", loginRoutes);
// app.use("/products", productRoutes);
// app.use("/cart", cartRoutes);
//app.use("/inventory", inventoryRoutes);

app.listen(3000, () => {
    console.log("Backend running");
});