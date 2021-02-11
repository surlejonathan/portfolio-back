const express = require("express");
const router = express.Router();

const admin = require("./admin");
const project = require("./project");

router.use("/admin", admin);
router.use("/project", project);

module.exports = router;
