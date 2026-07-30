const express = require("express");

const loginRoutes = require("./routes/loginRoutes");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Health check route for AWS ALB
app.get("/", (req, res) => {
    res.status(200).send("Ricemill backend running");
});

app.use("/login-container-cdk", loginRoutes);

// Start server
const PORT = 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend running on port ${PORT}`);
});