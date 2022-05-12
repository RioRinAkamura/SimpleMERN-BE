const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const app = express();

dotenv.config();

// CONNECT DATABASE
mongoose.connect(
    // process.env.DATABASE_URL,
    "mongodb+srv://rinnguyen:nguyenthanhrin260396@cluster0.eivch.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
        useNewUrlParser: "true",
        useUnifiedTopology: "true",
    },
    () => {
        console.log("Connected to MongoDB");
    }
);

// app.use(bodyParser.json({ limit: '30bm' }));
app.use(express.json());
app.use(cors());

// ROUTES
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
