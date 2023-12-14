const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const redis = require("redis");
// let RedisStore = require("connect-redis")(session);
const cors = require("cors");
let RedisStore = require("connect-redis").default

const {
    MONGO_USER,
    MONGO_PASSWORD,
    MONGO_IP,
    MONGO_PORT,
    REDIS_URL,
    SESSION_SECRET
} = require("./config/config");


const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

let redisClient = redis.createClient({
    url: REDIS_URL,
});
redisClient.connect().catch(console.error)

const app = express();

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
    // Added for mongoose after searching the IP address
    //mongoose.connect(
    //    "mongodb://sparkyk:password@192.168.160.2/?authSource=admin"
    //).then(
    //    () => console.log("Successfully connected to DB! :D")
    //).catch((e) => console.log(e));
    mongoose.connect(
        mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
        //"mongodb://sparkyk:password@mongo:27017/?authSource=admin"
    ).then(
        () => console.log("Successfully connected to DB! :D")
    ).catch((e) => {
        console.log(e)
        setTimeout(connectWithRetry, 5000)
    });
}

connectWithRetry();

app.enable("trust proxy");
app.use(cors())
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    cookie: {
        secure: false,
        httpOnly: true,
        resave: false,
        saveUninitialized: false,
        maxAge: 60000,
    }
}));


app.use(express.json()); // Add middleware to see post???
app.use(express.urlencoded({ extended: false }));

app.get("/api/v1", (req, res) => {
    res.send("<h2> Hi There!! :) </h2>");
    console.log("Yeah, it's load balancing!"); // This is to ensure that load-balancing is actually working.
});

// localhost:3000/api/v1/post/
app.use("/api/v1/posts", postRouter); // Check this in Postman
app.use("/api/v1/users", userRouter); // Check this in Postman


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));