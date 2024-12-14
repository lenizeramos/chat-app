import express from "express";
import path from "path";
import { apiRouter } from "./routes";
import session from "express-session";
import { SECRET, SESSION_MAX_AGE } from "./env";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: Number(SESSION_MAX_AGE) },
  })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(apiRouter);
