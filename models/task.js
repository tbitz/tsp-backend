const mongoose = require("mongoose");
const Joi = require("joi");

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  artist: { type: String, required: true },
  task: { type: String, required: true },
  img: { type: String, required: true },
  duration: { type: String, required: true },
});

const validate = (task) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    artist: Joi.string().required(),
    task: Joi.string().required(),
    img: Joi.string().required(),
    duration: Joi.number().required(),
  });
  return schema.validate(task);
};

const Task = mongoose.model("task", taskSchema);

module.exports = { Task, validate };
