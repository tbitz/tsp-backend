const router = require("express").Router();

router.get("/", async (req, res) => {
  res.status(200).send("Welcome unauthorized user!");
});

module.exports = router;
