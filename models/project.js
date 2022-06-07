const mongoose = require("mongoose");
const Joi = require("joi");

const ObjectId = mongoose.Schema.Types.ObjectId;

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  user: { type: ObjectId, ref: "user", required: true },
  description: { type: String },
  kwh: { type: Number },
  members: { type: [String], required: true, default: [] },
  customerId: { type: String, required: true },
});

const validate = (project) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    user: Joi.string().required(),
    description: Joi.string().allow(""),
    kwh: Joi.number().required(),
    members: Joi.array().items(Joi.string()),
    customerId: Joi.string().required(),
  });
  return schema.validate(project);
};

const Project = mongoose.model("project", projectSchema);

module.exports = { Project, validate };
