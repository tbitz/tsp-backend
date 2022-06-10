const mongoose = require("mongoose");
const Joi = require("joi");

const ObjectId = mongoose.Schema.Types.ObjectId;

const customerSchema = new mongoose.Schema({
  userId: { type: ObjectId, ref: "user", required: true },
  name: { type: String, required: true, unique: true },
  street: { type: String },
  zip: { type: Number },
  city: { type: String },
  phone: { type: String },
  done: { type: Boolean, default: false },
});

const validate = (customer) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    name: Joi.string().required(),
    street: Joi.string().required(),
    zip: Joi.number().required(),
    city: Joi.string().required(),
    phone: Joi.string().required(),
    done: Joi.boolean().optional(),
  });
  return schema.validate(customer);
};

const Customer = mongoose.model("customer", customerSchema);

module.exports = { Customer, validate };
