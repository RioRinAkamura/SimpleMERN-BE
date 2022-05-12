const express = require('express');
const cors = require("cors");
const dotenv = require("dotenv")
var bodyParser = require("body-parser")
const mongoose = require("mongoose")
const authRouter = require('./routes/auth')
const postRouter = require('./routes/post')
const app = express()

dotenv.config()
// CONNECT DATABASE
// mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.eivch.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, () => {

// console.log("Connected to MongoDB");
// })

const connectDB = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.eivch.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
            {
                useCreateIndex: true,
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            }
        )

        console.log('MongoDB connected')
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}
connectDB()

// app.use(bodyParser.json({ limit: '50bm' }));
app.use(express.json());
app.use(cors());

// ROUTES
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
