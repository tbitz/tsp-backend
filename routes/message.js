const router = require("express").Router();
const { Message, validate } = require("../models/message");
const { Task } = require("../models/task");
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const Joi = require("joi");

// create message
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  console.log(req.user);

  const user = await User.findById(req.user._id);
  const message = await Message({ ...req.body, user: user._id }).save();

  res.status(201).send({ data: message });
});

// patch message by id
router.patch("/:id", [validateObjectId, auth], async (req, res) => {
  const message = await Message.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.send({ data: message, message: "Patched message successfully" });
});

// edit message by id
router.put("/edit/:id", [validateObjectId, auth], async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow(""),
    img: Joi.string().allow(""),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const message = await Message.findById(req.params.id);
  if (!message) return res.status(404).send({ message: "Message not found" });

  const user = await User.findById(req.user._id);
  if (!user._id.equals(message.user))
    return res.status(403).send({ message: "User don't have access to edit!" });

  message.name = req.body.name;
  message.description = req.body.description;
  message.img = req.body.img;
  await message.save();

  res.status(200).send({ message: "Updated successfully" });
});

// remove task from message
router.put("/remove-task", auth, async (req, res) => {
  const schema = Joi.object({
    messageId: Joi.string().required(),
    taskId: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const user = await User.findById(req.user._id);
  const message = await Message.findById(req.body.messageId);
  if (!user._id.equals(message.user))
    return res
      .status(403)
      .send({ message: "User don't have access to Remove!" });

  const index = message.tasks.indexOf(req.body.taskId);
  message.tasks.splice(index, 1);
  await message.save();
  res.status(200).send({ data: message, message: "Removed from message" });
});

// user messages
router.get("/favourite", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  const messages = await Message.find({ _id: user.messages });
  res.status(200).send({ data: messages });
});

// get random messages
router.get("/random", auth, async (req, res) => {
  const messages = await Message.aggregate([{ $sample: { size: 10 } }]);
  res.status(200).send({ data: messages });
});

// get message by id
router.get("/:id", [validateObjectId, auth], async (req, res) => {
  const message = await Message.findById(req.params.id);
  if (!message) return res.status(404).send("not found");

  const tasks = await Task.find({ _id: message.tasks });
  res.status(200).send({ data: { message, tasks } });
});

// get all messages
router.get("/", auth, async (req, res) => {
  const messages = await Message.find();
  res.status(200).send({ data: messages });
});

// delete message by id
router.delete("/:id", [validateObjectId, auth], async (req, res) => {
  const user = await User.findById(req.user._id);
  const message = await Message.findById(req.params.id);

  // only admin or creator can delete a message
  if (user.role !== "Admin" && !user._id.equals(message.user))
    return res
      .status(403)
      .send({ message: "User don't have access to delete!" });

  const index = user.messages.indexOf(req.params.id);
  user.messages.splice(index, 1);
  await user.save();
  await message.remove();
  res.status(200).send({ message: "Removed from library" });
});

module.exports = router;
