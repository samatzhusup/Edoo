require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const helmet = require("helmet");
const path = require("path");
const compression = require("compression");

// Routes
const auth = require("./routes/auth");
const user = require("./routes/user");
const category = require("./routes/category");
const product = require("./routes/product");
const app = express();

// db connection
mongoose
  .connect("mongodb+srv://samat:Wzcw6nIXRwbhz0I0@cluster0.kn19a.mongodb.net/EdooMongoDB?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected 🍕"));

// middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(cookieParser());
app.use(expressValidator());
app.use(cors(process.env.CLIENT_URL));

// routes
app.use("/api", auth);
app.use("/api", user);
app.use("/api", category);
app.use("/api", product);


// serve static asstes if in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server running on port ${port} 🎆`));
