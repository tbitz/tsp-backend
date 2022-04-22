const router = require("express").Router();
const { Project, validate } = require("../models/project");
const { Task } = require("../models/task");
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const Joi = require("joi");

// create project
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const user = await User.findById(req.user._id);
  const project = await Project({ ...req.body, user: user._id }).save();
  user.projects.push(project._id);
  await user.save();

  res.status(201).send({ data: project });
});

// edit project by id
router.put("/edit/:id", [validateObjectId, auth], async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow(""),
    img: Joi.string().allow(""),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).send({ message: "Project not found" });

  const user = await User.findById(req.user._id);
  if (!user._id.equals(project.user))
    return res.status(403).send({ message: "User don't have access to edit!" });

  project.name = req.body.name;
  project.description = req.body.description;
  project.img = req.body.img;
  await project.save();

  res.status(200).send({ message: "Updated successfully" });
});

// add task to project
router.put("/add-task", auth, async (req, res) => {
  const schema = Joi.object({
    projectId: Joi.string().required(),
    taskId: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const user = await User.findById(req.user._id);
  const project = await Project.findById(req.body.projectId);
  if (!user._id.equals(project.user))
    return res.status(403).send({ message: "User don't have access to add!" });

  if (project.tasks.indexOf(req.body.taskId) === -1) {
    project.tasks.push(req.body.taskId);
  }
  await project.save();
  res.status(200).send({ data: project, message: "Added to project" });
});

// remove task from project
router.put("/remove-task", auth, async (req, res) => {
  const schema = Joi.object({
    projectId: Joi.string().required(),
    taskId: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const user = await User.findById(req.user._id);
  const project = await Project.findById(req.body.projectId);
  if (!user._id.equals(project.user))
    return res
      .status(403)
      .send({ message: "User don't have access to Remove!" });

  const index = project.tasks.indexOf(req.body.taskId);
  project.tasks.splice(index, 1);
  await project.save();
  res.status(200).send({ data: project, message: "Removed from project" });
});

// user projects
router.get("/favourite", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  const projects = await Project.find({ _id: user.projects });
  res.status(200).send({ data: projects });
});

// get random projects
router.get("/random", auth, async (req, res) => {
  const projects = await Project.aggregate([{ $sample: { size: 10 } }]);
  res.status(200).send({ data: projects });
});

// get project by id
router.get("/:id", [validateObjectId, auth], async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).send("not found");

  const tasks = await Task.find({ _id: project.tasks });
  res.status(200).send({ data: { project, tasks } });
});

// get all projects
router.get("/", auth, async (req, res) => {
  const projects = await Project.find();
  res.status(200).send({ data: projects });
});

// delete project by id
router.delete("/:id", [validateObjectId, auth], async (req, res) => {
  const user = await User.findById(req.user._id);
  const project = await Project.findById(req.params.id);
  if (!user._id.equals(project.user))
    return res
      .status(403)
      .send({ message: "User don't have access to delete!" });

  const index = user.projects.indexOf(req.params.id);
  user.projects.splice(index, 1);
  await user.save();
  await project.remove();
  res.status(200).send({ message: "Removed from library" });
});

module.exports = router;
