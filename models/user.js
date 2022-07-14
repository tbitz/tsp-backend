const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, required: true },
  initials: { type: String, required: true },
  color: { type: String, required: true },
  projects: { type: [String], required: true, default: [] },
  confirmed: { type: Boolean, default: false }, // we set it manually to true
  popup: { type: Date, required: true, default: new Date() },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, name: this.name, isAdmin: this.isAdmin, role: this.role },
    process.env.JWTPRIVATEKEY,
    { expiresIn: "7d" }
  );
  return token;
};

const validate = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().email().required(),
    password: passwordComplexity().required(),
    phone: Joi.string().required(),
    role: Joi.string().required(),
    initials: Joi.string().required(),
    color: Joi.string().required(),
    projects: Joi.array().items(Joi.string()),
    popup: Joi.string().allow(Date.now()),
  });
  return schema.validate(user);
};

const User = mongoose.model("user", userSchema);

module.exports = { User, validate };
