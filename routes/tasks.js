const router = require("express").Router();
const { User } = require("../models/user");
const { Step } = require("../models/step");
const { Task, validate, validateMultiple } = require("../models/task");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const { filteredTasks } = require("../permissions/tasksByPermission");

// Create task
router.post("/", auth, async (req, res) => {
  console.log("create task", req.body);
  const { error } = validate(req.body);
  if (error) res.status(400).send({ message: error.details[0].message });

  const user = await User.findById(req.user._id);
  const task = await Task({ ...req.body, user: user._id }).save();

  // const task = await Task(req.body).save();
  res.status(201).send({ data: task, message: "Task created successfully" });
});

// Create multiple tasks
router.post("/prefill", auth, async (req, res) => {
  console.log("CREATE MULTIPLE TASKS", req.body);
  const { error } = validateMultiple(req.body);
  if (error) res.status(400).send({ message: error.details });

  const user = await User.findById(req.user._id);
  const allTasks = req.body.map((task) => {
    return { ...task, user: user._id };
  });
  const tasks = await Task.insertMany(allTasks);

  res.status(201).send({
    data: tasks,
    message: "Multiple prefill tasks created successfully",
  });
});

// Get all tasks
router.get("/", auth, async (req, res) => {
  const steps = await Step.find();
  const tasks = await Task.find();

  res.status(200).send({ data: filteredTasks(req, steps, tasks) });
});

// Update task
router.put("/:id", [validateObjectId, auth], async (req, res) => {
  console.log("task update running");

  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.send({ data: task, message: "Updated task successfully" });
});

// Patch task
router.patch("/:id", [validateObjectId, auth], async (req, res) => {
  console.log("task patch running");
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.send({ data: task, message: "Patched task successfully" });
});

// Delete task by ID
router.delete("/:id", [validateObjectId, auth], async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.status(200).send({ message: "Task deleted sucessfully" });
});

// Like task
router.put("/like/:id", [validateObjectId, auth], async (req, res) => {
  let resMessage = "";
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(400).send({ message: "task does not exist" });

  const user = await User.findById(req.user._id);
  const index = user.urgentTasks.indexOf(task._id);
  if (index === -1) {
    user.urgentTasks.push(task._id);
    resMessage = "Added to your liked tasks";
  } else {
    user.urgentTasks.splice(index, 1);
    resMessage = "Removed from your liked tasks";
  }

  await user.save();
  res.status(200).send({ message: resMessage });
});

// Get liked tasks
router.get("/like", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  const tasks = await Task.find({ _id: user.urgentTasks });
  res.status(200).send({ data: tasks });
});

module.exports = router;
