import express from "express";

import routes from "./routes/index.mjs";

import cookieParser from "cookie-parser";

import session from "express-session";

import { mockUsers } from "../utils/constants.mjs";

import passport from "passport";

import "./strategies/local-strategy.mjs";

import mongoose from "mongoose";

const app = express();

mongoose
  .connect("mongodb://localhost/express_tutorial")
  .then(() => console.log("Connected To DB"))
  .catch((err) => console.log(err));

app.use(express.json());

app.use(cookieParser("helloworld"));

app.use(
  session({
    secret: "Ammar Yasser",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

const PORT = process.env.PORT || 3000;

app.post("/api/auth", passport.authenticate("local"), (req, res) => {
  res.sendStatus(200);
});

app.get("/api/auth/status", (req, res) => {
  console.log("From /api/auth/status");
  console.log(req.user);
  if (req.user) return res.send(req.user);
  res.sendStatus(401);
});

app.get("/", (request, response) => {
  request.session.visited = true;
  console.log(request.session);
  console.log(request.session.id);
  response.cookie("hello", "world", {
    maxAge: 30000,
    signed: true,
  });
  response.status(201).send({ msg: "hello" });
});

app.post("/api/auth/logout", (req, res) => {
  if (!req.user) return res.sendStatus(401);

  req.logOut((err) => {
    if (err) return res.sendStatus(401);
    res.sendStatus(200);
  });
});

// app.post("/api/auth", (req, res) => {
//   const {
//     body: { username, password },
//   } = req;

//   const findUser = mockUsers.find((user) => user.username == username);

//   if (!findUser || findUser.password !== password)
//     return res.status(401).send({ Msg: "BAD CREDENTIALS" });

//   req.session.user = findUser;

//   return res.status(200).send(findUser);
// });

app.get("/api/auth/status", (req, res) => {
  req.sessionStore.get(req.sessionID, (err, session) => {
    console.log(session);
  });
  req.session.user
    ? res.status(200).send(req.session.user)
    : res.status(401).send({ Msg: "BAD CREDENTIALS" });
});

app.post("/api/cart", (req, res) => {
  if (!req.session.user) return res.sendStatus(401);

  const { body: item } = req;

  const { cart } = req.session;

  if (cart) {
    cart.push(item);
  } else {
    req.session.cart = [item];
  }
  return res.status(201).send(item);
});

app.get("/api/cart", (req, res) => {
  if (!req.session.user) return res.sendStatus(401);
  return res.send(req.session.cart ?? []);
});

app.listen(PORT, () => {
  console.log(`Listning on port ${PORT}`);
});
