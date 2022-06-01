const mongoose = require("mongoose");
const Joi = require("joi");

const ObjectId = mongoose.Schema.Types.ObjectId;

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  user: { type: ObjectId, ref: "user", required: true },
  description: { type: String },
  kwh: { type: String },
  members: { type: [String], required: true, default: [] },
});

const validate = (project) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    user: Joi.string().required(),
    description: Joi.string().allow(""),
    kwh: Joi.string().required(),
    members: Joi.array().items(Joi.string()),
  });
  return schema.validate(project);
};

const Project = mongoose.model("project", projectSchema);

module.exports = { Project, validate };
