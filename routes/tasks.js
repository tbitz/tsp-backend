const router = require("express").Router();
const { User } = require("../models/user");
const { Task, validate } = require("../models/task");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");

// Create task
router.post("/", admin, async (req, res) => {
  const { error } = validate(req.body);
  if (error) res.status(400).send({ message: error.details[0].message });

  const task = await Task(req.body).save();
  res.status(201).send({ data: task, message: "Task created successfully" });
});

// Get all tasks
router.get("/", async (req, res) => {
  const tasks = await Task.find();
  res.status(200).send({ data: tasks });
});

// Update task
router.put("/:id", [validateObjectId, admin], async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.send({ data: task, message: "Updated task successfully" });
});

// Delete task by ID
router.delete("/:id", [validateObjectId, admin], async (req, res) => {
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
