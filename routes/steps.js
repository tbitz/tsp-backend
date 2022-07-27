const router = require("express").Router();
const { Step } = require("../models/step");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const { filteredSteps } = require("../permissions/stepsByPermission");
const { User } = require("../models/user");
const { Category } = require("../models/category");

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
router.post("/createMultiple", auth, async (req, res) => {
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

// :id = oldProjectId, hardcoded new projectId
router.patch("/patchAllSteps", auth, async (req, res) => {
  const steps = req.body;

  // only admin or creator can delete a category
  if (req.user.role !== "Admin")
    return res
      .status(403)
      .send({ message: "User doesn't have rights to update steps!" });

  steps.forEach(async (step) => {
    await Step.findByIdAndUpdate(
      step._id,
      { userIds: step.userIds },
      {
        new: true,
      }
    );
  });

  res
    .status(200)
    .send({ data: steps, message: "All steps were updated successfully!" });
});

// delete category by id
router.delete(
  "/deleteMultiple/:id",
  [validateObjectId, auth],
  async (req, res) => {
    const user = await User.findById(req.user._id);
    const category = await Category.findById(req.params.id);
    const steps = await Step.find();

    // only admin or creator can delete a category
    if (user.role !== "Admin" && !user._id.equals(category.user))
      return res
        .status(403)
        .send({ message: "User don't have access to delete!" });

    steps.forEach(async (step) => {
      if (step.categoryId === req.params.id) {
        await step.remove();
      }
    });

    res.status(200).send({ message: "Steps gelöscht" });
  }
);

module.exports = router;
