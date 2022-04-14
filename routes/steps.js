const router = require("express").Router();
const { Step } = require("../models/step");
const auth = require("../middleware/auth");

// get all steps
router.get("/", auth, async (req, res) => {
  const steps = await Step.find();
  res.status(200).send({ data: steps });
});

module.exports = router;
