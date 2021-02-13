const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 8080;
const routes = require("./routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api", routes);

app.get("/", (req, res) => {
  res.status(200).json("Hello World");
});
app.listen(port, (err) => {
  if (err) {
    throw err;
  }

  console.log(`Le serveur fonctionne sur le port ${port}.`);
});
