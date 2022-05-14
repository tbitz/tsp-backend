const mongoose = require("mongoose");
const Joi = require("joi");
const ObjectId = mongoose.Schema.Types.ObjectId;

const taskSchema = new mongoose.Schema({
  user: { type: ObjectId, ref: "user", required: true },
  columnId: { type: String, required: true },
  projectId: { type: String, required: true },
  stepId: { type: String, required: true },
  title: { type: String, required: true },
  priority: { type: String, enum: ["High", "Medium", "Low"], required: true },
  description: { type: String, required: false },
  labels: { type: [String], default: [] },
  assignees: { type: [String], default: [] },
  comments: { type: [Object], default: [] },
  startDate: { type: Date, default: "" },
  endDate: { type: Date, default: "" },
});

const validate = (task) => {
  const schema = Joi.object({
    user: Joi.string().required(),
    columnId: Joi.string().required(),
    projectId: Joi.string().required(),
    stepId: Joi.string().required(),
    title: Joi.string().required(),
    priority: Joi.string().required(),
    description: Joi.string().allow(""),
    labels: Joi.array().items(Joi.string()),
    assignees: Joi.array().items(Joi.string().optional()),
    comments: Joi.array().items(Joi.object()),
    startDate: Joi.date().required(),
    endDate: Joi.date().optional(),
  });
  return schema.validate(task);
};

const validateMultiple = (tasks) => {
  const schema = Joi.array().items({
    columnId: Joi.string().required(),
    projectId: Joi.string().required(),
    stepId: Joi.string().required(),
    title: Joi.string().required(),
    priority: Joi.string().required(),
    description: Joi.string().allow(""),
    labels: Joi.array().items(Joi.string()),
    assignees: Joi.array().items(Joi.string().optional()),
    comments: Joi.array().items(Joi.object()),
    startDate: Joi.date().required(),
    endDate: Joi.date().optional(),
    user: Joi.string().required(),
  });
  console.log("validateMultiple: ", schema.validate(tasks));
  return schema.validate(tasks);
};

const Task = mongoose.model("task", taskSchema);

module.exports = { Task, validate, validateMultiple };
