const express = require("express");
const router = express.Router();
const connection = require("../config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// CREATE ADMIN

router.post("/", (req, res) => {
  const hash = bcrypt.hashSync(req.body.password, 10);
  const admin = {
    name_admin: req.body.name_admin,
    password: hash,
  };
  const sql = "INSERT INTO admin SET ?";

  return connection.query(sql, [admin], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message, sql: err.sql });
    } else {
      return res.status(201).json(result);
    }
  });
});

// GET LIST OF ADMINS

router.get("/hello", (req, res) => {
  res.status(200).json("Hello you!");
});
router.get("/", (req, res) => {
  const sql = "SELECT * FROM admin WHERE name_admin='liljon'";
  connection.query(sql, (err, results) => {
    if (err) {
      res.status(500).json(err.message);
    } else if (results.length === 0) {
      res
        .status(404)
        .json("No users were found yet. Please try again later...");
    } else {
      res.status(200).json(results);
    }
  });
});

// SIGN IN

router.post("/login", (req, res) => {
  const dataUser = {
    name_admin: req.body.name_admin,
    password: req.body.password,
  };

  connection.query(
    "SELECT * FROM admin WHERE name_admin = ?",
    [dataUser.name_admin],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else if (result.length === 0) {
        return res
          .status(404)
          .json({ error: "Please check the email you've tried to log with" });
      } else {
        const goodPassword = bcrypt.compareSync(
          dataUser.password,
          result[0].password
        );
        if (goodPassword) {
          jwt.sign({ result }, process.env.SECRETKEY_JWT, (err, token) => {
            res.json({ token });
          });
        } else {
          res.sendStatus(500);
        }
      }
    }
  );
});

// PROFILE AUTHENTICATION

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  }
};

router.post("/profile", verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.SECRETKEY_JWT, (err, user) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({ message: "super utilisateur", user });
    }
  });
});

module.exports = router;
