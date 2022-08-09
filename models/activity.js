const mongoose = require("mongoose");
const Joi = require("joi");

const ObjectId = mongoose.Schema.Types.ObjectId;

/**
 * title: string  -> from enum (created task, edited task, commented task, uploaded document, finished task, checked checkbox, changed rights, hasFinishedProject, hasChargedProject, hasCreatedCustomer )
 * time: string -> time of activity 16545454
 * haveSeen: [] -> users that have seen the activity
 * isSecret -> only for admin
 */
const activitySchema = new mongoose.Schema({
  projectId: { type: String, required: false, default: "" },
  customerId: { type: String, required: false, default: "" },
  taskId: { type: String, required: false, default: "" },

  userId: { type: String, required: true },
  status: { type: String, required: true },
  title: { type: String, required: true },
  time: { type: Date, required: true },
  haveSeen: { type: [String], required: true, default: [] },
  isSecret: { type: Boolean, default: false },
});

const validate = (activity) => {
  const schema = Joi.object({
    projectId: Joi.string().optional(),
    customerId: Joi.string().optional(),
    taskId: Joi.string().optional(),

    userId: Joi.string().required(),
    status: Joi.string().required(),
    title: Joi.string().required(),
    time: Joi.date().required(),
    haveSeen: Joi.array().items(Joi.string()),
    isSecret: Joi.boolean().optional(),
  });
  return schema.validate(activity);
};

const Activity = mongoose.model("activity", activitySchema);

module.exports = { Activity, validate };
