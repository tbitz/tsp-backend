const router = require("express").Router();
const { Label, validate } = require("../models/label");
const { Task } = require("../models/task");
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const Joi = require("joi");

// create label
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const label = await Label({ ...req.body }).save();
  res.status(201).send({ data: label });
});

// edit label by id
router.put("/edit/:id", [validateObjectId, auth], async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const label = await Label.findById(req.params.id);
  if (!label) return res.status(404).send({ message: "Label not found" });

  const user = await User.findById(req.user._id);
  if (!user._id.equals(label.user))
    return res.status(403).send({ message: "User don't have access to edit!" });

  label.name = req.body.name;
  await label.save();

  res.status(200).send({ message: "Updated successfully" });
});

// get label by id
router.get("/:id", [validateObjectId, auth], async (req, res) => {
  const label = await Label.findById(req.params.id);
  if (!label) return res.status(404).send("not found");

  // maybe not destructured
  res.status(200).send({ data: { label } });
});

// get all labels
router.get("/", auth, async (req, res) => {
  const labels = await Label.find();
  res.status(200).send({ data: labels });
});

// delete label by id
router.delete("/:id", [validateObjectId, auth], async (req, res) => {
  const user = await User.findById(req.user._id);
  const label = await Label.findById(req.params.id);
  if (!user._id.equals(label.user))
    return res
      .status(403)
      .send({ message: "User don't have access to delete!" });

  const index = user.labels.indexOf(req.params.id);
  user.labels.splice(index, 1);
  await user.save();
  await label.remove();
  res.status(200).send({ message: "Removed from library" });
});

module.exports = router;
