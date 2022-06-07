const router = require("express").Router();
const { Customer, validate } = require("../models/customer");
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const Joi = require("joi");

// create customer
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const customer = await Customer(req.body).save();

  res.status(201).send({ data: customer });
});

// edit customer by id
router.put("/edit/:id", [validateObjectId, auth], async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow(""),
    img: Joi.string().allow(""),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).send({ message: "Customer not found" });

  const user = await User.findById(req.user._id);
  if (!user._id.equals(customer.user))
    return res.status(403).send({ message: "User don't have access to edit!" });

  customer.name = req.body.name;
  customer.description = req.body.description;
  customer.img = req.body.img;
  await customer.save();

  res.status(200).send({ message: "Updated successfully" });
});

// get customer by id
router.get("/:id", [validateObjectId, auth], async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).send("not found");

  const tasks = await Task.find({ _id: customer.tasks });
  res.status(200).send({ data: { customer, tasks } });
});

// get all customers
router.get("/", auth, async (req, res) => {
  const customers = await Customer.find();
  res.status(200).send({ data: customers });
});

// delete customer by id
router.delete("/:id", [validateObjectId, auth], async (req, res) => {
  const user = await User.findById(req.user._id);
  const customer = await Customer.findById(req.params.id);
  if (!user._id.equals(customer.user))
    return res
      .status(403)
      .send({ message: "User don't have access to delete!" });

  const index = user.customers.indexOf(req.params.id);
  user.customers.splice(index, 1);
  await user.save();
  await customer.remove();
  res.status(200).send({ message: "Removed from library" });
});

module.exports = router;
