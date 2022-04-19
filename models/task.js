const mongoose = require("mongoose");
const Joi = require("joi");

const ObjectId = mongoose.Schema.Types.ObjectId;

const taskSchema = new mongoose.Schema({
  user: { type: ObjectId, ref: "user", required: true },
  columnId: { type: String, required: true },
  title: { type: String, required: true },
  priority: { type: String, enum: ["H", "M", "L"], required: true },
  description: { type: String, required: false },
  labels: { type: [String], default: [] },
  assignees: { type: [String], default: [] },
});

const validate = (task) => {
  const schema = Joi.object({
    user: Joi.string().required(),
    columnId: Joi.string().required(),
    title: Joi.string().required(),
    priority: Joi.string().required(),
    description: Joi.string().allow(""),
    labels: Joi.array().items(Joi.string()),
    assignees: Joi.array().items(Joi.string().optional()),
  });
  return schema.validate(task);
};

const Task = mongoose.model("task", taskSchema);

module.exports = { Task, validate };
