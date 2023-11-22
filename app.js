import express from "express";
import expressLayouts from "express-ejs-layouts";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import flash from "express-flash";
import "dotenv/config.js";

import { initializePassport } from "./config/initialize-passport.js";
import admin_router from "./routes/admin-router.js";
import login_router from "./routes/login-router.js";
import fuel_router from "./routes/fuel-router.js";
import { models } from "./model/db.js";
import { port } from "./config.js";

initializePassport(passport);
const app = express();
app.use(cookieParser());
// add all models to req object
app.use((req, res, next) => {
  req.models = {
    ...models,
  };
  next();
});


app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(expressLayouts);

app.use(flash());
app.use(
  session({
    secret: "secret",
    saveUninitialized: false,
    resave: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");
app.set("layout", "./layout/main-layout");

app.use("/", login_router);
app.use("/fuels", fuel_router);
app.use("/users", admin_router);

app.use("", async (req, res) => {
  res.render("404", { page_name: "یافت نشد", fullname: "", user: ""});
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
