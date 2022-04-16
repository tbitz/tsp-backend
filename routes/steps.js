const router = require("express").Router();
const { Step } = require("../models/step");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");

// get all steps
router.get("/", auth, async (req, res) => {
  const steps = await Step.find();
  res.status(200).send({ data: steps });
});

// get step by id
router.get("/:id", [validateObjectId, auth], async (req, res) => {
  const step = await Step.findById(req.params.id);
  if (!step) return res.status(404).send("not found");

  // enable once you need tasks
  // const tasks = await Task.find({ _id: step.tasks });
  // res.status(200).send({ data: { step, tasks } });
  res.status(200).send({ data: { step } });
});

module.exports = router;
