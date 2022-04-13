const router = require("express").Router();
const { Task } = require("../models/task");
const { Project } = require("../models/project");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  const search = req.query.search;
  if (search !== "") {
    const tasks = await Task.find({
      name: { $regex: search, $options: "i" },
    }).limit(10);
    const projects = await Project.find({
      name: { $regex: search, $options: "i" },
    }).limit(10);
    const result = { tasks, projects };
    res.status(200).send(result);
  } else {
    res.status(200).send({});
  }
});

module.exports = router;
