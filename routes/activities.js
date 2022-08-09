const router = require("express").Router();
const { Activity, validate } = require("../models/activity");
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const Joi = require("joi");
const { Project } = require("../models/project");
const { filteredProjects } = require("../permissions/projectsByPermission");

// get all activities -> only which allowed to see
router.get("/", auth, async (req, res) => {
  const activities = await Activity.find();
  res.status(200).send({ data: activities });
});

// create activities
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const activities = await Activity(req.body).save();

  res.status(201).send({ data: activities });
});

// patch activities by id
router.patch("/:id", [validateObjectId, auth], async (req, res) => {
  const activities = await Activity.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.send({ data: activities, message: "Patched activities successfully" });
});

// edit activities by id
router.put("/edit/:id", [validateObjectId, auth], async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow(""),
    img: Joi.string().allow(""),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const activities = await Activity.findById(req.params.id);
  if (!activities)
    return res.status(404).send({ message: "Activity not found" });

  const user = await User.findById(req.user._id);
  if (!user._id.equals(activities.user))
    return res.status(403).send({ message: "User don't have access to edit!" });

  activities.name = req.body.name;
  activities.description = req.body.description;
  activities.img = req.body.img;
  await activities.save();

  res.status(200).send({ message: "Updated successfully" });
});

// Delete activity by ID
router.delete("/:id", [validateObjectId, auth], async (req, res) => {
  await Activity.findByIdAndDelete(req.params.id);
  res.status(200).send({ message: "Activity deleted sucessfully" });
});

module.exports = router;
