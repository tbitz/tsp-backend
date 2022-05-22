const router = require("express").Router();
const { Column, validate } = require("../models/column");
const { Task } = require("../models/task");
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const Joi = require("joi");

// create column
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const user = await User.findById(req.user._id);
  const column = await Column({ ...req.body, user: user._id }).save();
  user.columns.push(column._id);
  await user.save();

  res.status(201).send({ data: column });
});

// edit column by id
router.put("/edit/:id", [validateObjectId, auth], async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const column = await Column.findById(req.params.id);
  if (!column) return res.status(404).send({ message: "Column not found" });

  const user = await User.findById(req.user._id);
  if (!user._id.equals(column.user))
    return res.status(403).send({ message: "User don't have access to edit!" });

  column.name = req.body.name;
  await column.save();

  res.status(200).send({ message: "Updated successfully" });
});

// remove task from column
router.put("/remove-task", auth, async (req, res) => {
  const schema = Joi.object({
    columnId: Joi.string().required(),
    taskId: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const user = await User.findById(req.user._id);
  const column = await Column.findById(req.body.columnId);
  if (!user._id.equals(column.user))
    return res
      .status(403)
      .send({ message: "User don't have access to Remove!" });

  const index = column.tasks.indexOf(req.body.taskId);
  column.tasks.splice(index, 1);
  await column.save();
  res.status(200).send({ data: column, message: "Removed from column" });
});

// user columns
router.get("/favourite", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  const columns = await Column.find({ _id: user.columns });
  res.status(200).send({ data: columns });
});

// get random columns
router.get("/random", auth, async (req, res) => {
  const columns = await Column.aggregate([{ $sample: { size: 10 } }]);
  res.status(200).send({ data: columns });
});

// get column by id
router.get("/:id", [validateObjectId, auth], async (req, res) => {
  const column = await Column.findById(req.params.id);
  if (!column) return res.status(404).send("not found");

  const tasks = await Task.find({ _id: column.tasks });
  res.status(200).send({ data: { column, tasks } });
});

// get all columns
router.get("/", auth, async (req, res) => {
  const columns = await Column.find();
  res.status(200).send({ data: columns });
});

// delete column by id
router.delete("/:id", [validateObjectId, auth], async (req, res) => {
  const user = await User.findById(req.user._id);
  const column = await Column.findById(req.params.id);
  if (!user._id.equals(column.user))
    return res
      .status(403)
      .send({ message: "User don't have access to delete!" });

  const index = user.columns.indexOf(req.params.id);
  user.columns.splice(index, 1);
  await user.save();
  await column.remove();
  res.status(200).send({ message: "Removed from library" });
});

module.exports = router;
