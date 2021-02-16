const express = require("express");
const router = express.Router();
const connection = require("../config");

// CREATE PROJECT

router.post("/", (req, res) => {
  const sql = "INSERT INTO project SET ?";
  const data = {
    project_name: req.body.project_name,
    project_picture: req.body.project_picture,
    project_presentation: req.body.project_presentation,
    project_url: req.body.project_url,
    project_techno: req.body.project_techno,
  };
  return connection.query(sql, data, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message, sql: err.sql });
    } else {
      return res.status(201).json(result);
    }
  });
});

// GET LIST OF PROJECTS

router.get("/", (req, res) => {
  const sql = "SELECT * FROM project";
  connection.query(sql, (err, results) => {
    if (err) {
      res.status(500).json(err.message);
    } else if (results.length === 0) {
      res
        .status(404)
        .json("No projects were found yet. Please try again later...");
    } else {
      res.status(200).json(results);
    }
  });
});

// GET A PROJECT BY ID

router.get("/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM project WHERE idproject =  ?";
  connection.query(sql, id, (err, results) => {
    if (err) {
      res.status(500).json(err.message);
    } else if (results.length === 0) {
      res
        .status(404)
        .json("No projects were found yet. Please try again later...");
    } else {
      res.status(200).json(results);
    }
  });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM project WHERE idproject = ?";
  connection.query(sql, id, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res
        .status(200)
        .json(
          `The project with the id ${id} has been deleted successfully from favourites!`
        );
    }
  });
});
module.exports = router;
