const mongoose = require("mongoose");
const Joi = require("joi");
const ObjectId = mongoose.Schema.Types.ObjectId;

/**
 * TODO: more precise Objects
 */
const taskSchema = new mongoose.Schema({
  user: { type: ObjectId, ref: "user", required: true },
  columnId: { type: String, required: true },
  projectId: { type: String, required: true },
  stepId: { type: String, required: true },
  title: { type: String, required: true },
  priority: {
    type: String,
    enum: ["Hoch", "Mittel", "Tief"],
    required: false,
    default: "Mittel",
  },
  description: { type: String, required: false, default: "" },
  assignee: {
    type: Object,
    required: false,
    default: { id: "", initials: "" },
  },
  labels: { type: [String], default: [] },
  comments: { type: [Object], default: [] },
  checklist: { type: [Object], default: [] },
  startDate: { type: Date, default: "" },
  endDate: { type: Date, default: "" },
  focused: { type: String, default: "" },
});

const validate = (task) => {
  const schema = Joi.object({
    user: Joi.string().required(),
    columnId: Joi.string().required(),
    projectId: Joi.string().required(),
    stepId: Joi.string().required(),
    title: Joi.string().required(),
    priority: Joi.string().optional(),
    description: Joi.string().allow(""),
    assignee: Joi.object().optional(),
    labels: Joi.array().items(Joi.string()),
    comments: Joi.array().items(Joi.object()),
    checklist: Joi.array().items(Joi.object()),
    startDate: Joi.string().required(),
    endDate: Joi.string().allow(""),
    focused: Joi.string().allow(""),
  });
  return schema.validate(task);
};

const validateMultiple = (tasks) => {
  const schema = Joi.array().items({
    user: Joi.string().required(),
    columnId: Joi.string().required(),
    projectId: Joi.string().required(),
    stepId: Joi.string().required(),
    title: Joi.string().required(),
    priority: Joi.string().optional(),
    description: Joi.string().allow(""),
    assignee: Joi.object().optional(),
    labels: Joi.array().items(Joi.string()),
    comments: Joi.array().items(Joi.object()),
    checklist: Joi.array().items(Joi.object()),
    startDate: Joi.string().required(),
    endDate: Joi.string().allow(""),
    focused: Joi.string().allow(""),
  });
  return schema.validate(tasks);
};

const Task = mongoose.model("task", taskSchema);

module.exports = { Task, validate, validateMultiple };
