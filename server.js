const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path");
const ejs = require("ejs");

const connectDB = require("./config/db");
connectDB();

// Template engines
app.use(express.static("public"));
app.use(express.json());
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

// Routes
app.use("/", require("./routes/main"));
app.use("/api/files", require("./routes/files"));
app.use("/files", require("./routes/show"));

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
