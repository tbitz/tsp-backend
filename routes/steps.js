const router = require("express").Router();
const { Step } = require("../models/step");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const { filteredSteps } = require("../permissions/stepsByPermission");
const { User } = require("../models/user");

// get all steps
router.get("/", auth, async (req, res) => {
  const steps = await Step.find();

  res.status(200).send({ data: filteredSteps(req, steps) });
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

// create multiple steps
router.post("/multiple", auth, async (req, res) => {
  const user = await User.findById(req.user._id);

  const allSteps = req.body.map((step) => {
    return { ...step, user: user._id };
  });
  const steps = await Step.insertMany(allSteps);

  res.status(201).send({
    data: steps,
    message: "Multiple steps created successfully",
  });
});

module.exports = router;
