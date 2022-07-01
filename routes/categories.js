const router = require("express").Router();
const { Category, validate } = require("../models/category");
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const Joi = require("joi");

// get all categories
router.get("/", auth, async (req, res) => {
  const categories = await Category.find();
  res.status(200).send({ data: categories });
});

// create category
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const user = await User.findById(req.user._id);
  const category = await Category({ ...req.body, user: user._id }).save();

  res.status(201).send({ data: category });
});

// patch category by id
router.patch("/:id", [validateObjectId, auth], async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.send({ data: category, message: "Patched category successfully" });
});

// remove task from category
router.put("/remove-task", auth, async (req, res) => {
  const schema = Joi.object({
    categoryId: Joi.string().required(),
    taskId: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const user = await User.findById(req.user._id);
  const category = await Category.findById(req.body.categoryId);
  if (!user._id.equals(category.user))
    return res
      .status(403)
      .send({ message: "User don't have access to Remove!" });

  const index = category.tasks.indexOf(req.body.taskId);
  category.tasks.splice(index, 1);
  await category.save();
  res.status(200).send({ data: category, message: "Removed from category" });
});

// delete category by id
router.delete("/:id", [validateObjectId, auth], async (req, res) => {
  const user = await User.findById(req.user._id);
  const category = await Category.findById(req.params.id);

  // only admin or creator can delete a category
  if (user.role !== "Admin" && !user._id.equals(category.user))
    return res
      .status(403)
      .send({ message: "User don't have access to delete!" });

  const index = user.categories.indexOf(req.params.id);
  user.categories.splice(index, 1);
  await user.save();
  await category.remove();
  res.status(200).send({ message: "Removed from library" });
});

module.exports = router;
