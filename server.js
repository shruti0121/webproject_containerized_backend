const express = require("express");

const loginRoutes = require("./routes/loginRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const cartRoutes = require("./routes/cartRoute.js");
const additemcartRoutes = require("./routes/additemcartRoute.js");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Health check route for AWS ALB
app.get("/", (req, res) => {
    res.status(200).send("Ricemill backend running");
});

app.use("/login-container-cdk", loginRoutes);
app.use("/product-container-cdk", productRoutes);
app.use("/cartcount-container-cdk", cartRoutes);
app.use("/additemcart-container-cdk", additemcartRoutes);

// Start server
const PORT = 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend running on port ${PORT}`);
});