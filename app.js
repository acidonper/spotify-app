const mongoose = require("mongoose");

require("dotenv").config();
const DB_PORT = process.env.MONGO_PORT;
const DB_HOST = process.env.MONGO_HOST;
const DB_NAME = process.env.MONGODB_DATABASE;
const DB_USER = process.env.MONGODB_USER;
const DB_PASS = process.env.MONGODB_PASSWORD;

let DB_CON;

if (DB_USER !== undefined) {
    DB_CON = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
} else {
    DB_CON = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
}

console.log(DB_CON);

mongoose
    .connect(DB_CON, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(result => {
        console.log(
            `Connection to mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME} established`
        );
    })
    .catch(error => {
        throw error;
    });

const hbs = require("hbs");
const Express = require("express");
const app = Express();

const bodyParser = require("body-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

app.use(
    session({
        secret: "basic-auth",
        resave: true,
        saveUninitialized: true,
        cookie: { secure: false },
        store: new MongoStore({
            mongooseConnection: mongoose.connection
        })
    })
);

app.use(Express.static(__dirname + "/public"));
app.set("views", __dirname + "/views");
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", require("./routes/app"));
app.use("/security", require("./routes/security"));
app.use("/spotify", require("./routes/spotify"));
app.use("/users", require("./routes/users"));

app.use((req, res) => res.status(404).json({ message: "route not found" }));

const SERVER_PORT = process.env.SERVER_PORT || 5000;

app.listen(SERVER_PORT, () => {
    console.log(`Server listening on port ${SERVER_PORT} `);
});
