const router = require("express").Router();
const { Customer, validate } = require("../models/customer");
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const Joi = require("joi");
const { Project } = require("../models/project");
const { filteredCustomers } = require("../permissions/customersByPermission");
const { filteredProjects } = require("../permissions/projectsByPermission");

// create customer
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const customer = await Customer(req.body).save();

  res.status(201).send({ data: customer });
});

// patch customer by id
router.patch("/:id", [validateObjectId, auth], async (req, res) => {
  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.send({ data: customer, message: "Patched customer successfully" });
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
  const projects = await Project.find();
  const customers = await Customer.find();
  const eligibleProjects = await filteredProjects(req, projects);
  const eligibleCustomerIds = eligibleProjects.map(
    (project) => project.customerId
  );

  res
    .status(200)
    .send({ data: filteredCustomers(req, customers, eligibleCustomerIds) });
});

// Delete task by ID
router.delete("/:id", [validateObjectId, auth], async (req, res) => {
  await Customer.findByIdAndDelete(req.params.id);
  res.status(200).send({ message: "Customer deleted sucessfully" });
});

// delete customer by id (ONLY owner of the customer)
/* router.delete("/:id", [validateObjectId, auth], async (req, res) => {
  console.log(req);
  const user = await User.findById(req.user._id);
  const customer = await Customer.findById(req.params.id);

  // that's how you could restrict someone else from deleting your projects
  if (!user._id.equals(customer.user))
    return res
      .status(403)
      .send({ message: "User don't have access to delete!" });

  const index = user.customers.indexOf(req.params.id);
  user.customers.splice(index, 1);
  await user.save();
  await customer.remove();
  res.status(200).send({ message: "Removed from library" });
}); */

module.exports = router;
