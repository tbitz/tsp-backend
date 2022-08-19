const router = require("express").Router();
const { Process, validate } = require("../models/process");
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const Joi = require("joi");

// get all processes
router.get("/", auth, async (req, res) => {
  const processes = await Process.find();
  res.status(200).send({ data: processes });
});

// create process
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const user = await User.findById(req.user._id);
  const process = await Process({ ...req.body, user: user._id }).save();

  res.status(201).send({ data: process });
});

// patch process by id
router.patch("/:id", [validateObjectId, auth], async (req, res) => {
  const process = await Process.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.send({ data: process, message: "Patched process successfully" });
});

// remove task from process
router.put("/remove-task", auth, async (req, res) => {
  const schema = Joi.object({
    processId: Joi.string().required(),
    taskId: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const user = await User.findById(req.user._id);
  const process = await Process.findById(req.body.processId);
  if (!user._id.equals(process.user))
    return res
      .status(403)
      .send({ message: "User don't have access to Remove!" });

  const index = process.tasks.indexOf(req.body.taskId);
  process.tasks.splice(index, 1);
  await process.save();
  res.status(200).send({ data: process, message: "Removed from process" });
});

// delete process by id
router.delete("/:id", [validateObjectId, auth], async (req, res) => {
  const user = await User.findById(req.user._id);
  const process = await Process.findById(req.params.id);

  // only admin or creator can delete a process
  if (user.role !== "Admin" && !user._id.equals(process.user))
    return res
      .status(403)
      .send({ message: "User don't have access to delete!" });

  await process.remove();
  res.status(200).send({ message: "Removed process" });
});

module.exports = router;
