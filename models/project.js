const mongoose = require("mongoose");
const Joi = require("joi");

const ObjectId = mongoose.Schema.Types.ObjectId;

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  user: { type: ObjectId, ref: "user", required: true },
  description: { type: String },
  kwp: { type: Number, required: true },
  members: { type: [String], required: true, default: [] },
  customerId: { type: String, required: true },
  done: { type: Boolean, default: false },
});

const validate = (project) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    user: Joi.string().required(),
    description: Joi.string().allow(""),
    kwp: Joi.number().required(),
    members: Joi.array().items(Joi.string()),
    customerId: Joi.string().required(),
    done: Joi.boolean().optional(),
  });
  return schema.validate(project);
};

const Project = mongoose.model("project", projectSchema);

module.exports = { Project, validate };
