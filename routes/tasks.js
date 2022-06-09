const router = require("express").Router();
const { User } = require("../models/user");
const { Step } = require("../models/step");
const { Task, validate, validateMultiple } = require("../models/task");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const { filteredTasks } = require("../permissions/tasksByPermission");
const { Project } = require("../models/project");

// Create task
router.post("/", auth, async (req, res) => {
  console.log("CREATE TASK", req.body);
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

// Get tasks by stepId
/* router.get("/", auth, async (req, res) => {
  const steps = await Step.find();
  const tasks = await Task.find();

  res.status(200).send({ data: filteredTasks(req, steps, tasks) });
}); */

// Get all tasks
router.get("/", auth, async (req, res) => {
  const steps = await Step.find();
  const tasks = await Task.find();

  res.status(200).send({ data: filteredTasks(req, steps, tasks) });
});

// Update task
router.put("/:id", [validateObjectId, auth], async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.send({ data: task, message: "Updated task successfully" });
});

// Patch task
router.patch("/:id", [validateObjectId, auth], async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.send({ data: task, message: "Patched task successfully" });
});

// PatchAndMove task
router.put("/move/:id", [validateObjectId, auth], async (req, res) => {
  console.log("TASK PATCH AND MOVE \n", req.params.id, req.body);
  const task = await Task.findByIdAndUpdate(req.params.id, req.body.task, {
    new: true,
  });

  // await Task.findByIdAndDelete(req.params.id);

  // const otherTask = await Task.find({ _id: req.body.otherTaskId });

  res.send({ data: task, message: "Patched and moved task successfully" });
});

// Delete task by ID
router.delete("/:id", [validateObjectId, auth], async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.status(200).send({ message: "Task deleted sucessfully" });
});

// Deletes all tasks and the project
router.delete("/all/:id", [validateObjectId, auth], async (req, res) => {
  const tasks = await Task.find();
  const tasksToDelete = tasks.filter(
    (task) => task.projectId === req.params.id
  );

  tasksToDelete.forEach(async (task) => await Task.findByIdAndDelete(task._id));
  await Project.findByIdAndDelete(req.params.id);
  res.status(200).send({ message: "Tasks deleted sucessfully" });
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
