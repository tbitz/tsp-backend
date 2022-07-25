const mongoose = require("mongoose");
const Joi = require("joi");

const stepSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stepIndex: { type: String, required: true },
  categoryId: { type: String, required: true },
  prefillTasks: { type: [Object], default: [] },
});

const validate = (category) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    stepIndex: Joi.string().required(),
    categoryId: Joi.string().required(),
    prefillTasks: Joi.array().items(Joi.object()),
  });
  return schema.validate(category);
};

const Step = mongoose.model("step", stepSchema);

module.exports = { Step, validate };
