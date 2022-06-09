const { isAdmin } = require("./utils");

const filteredProjects = (req, projects) =>
  isAdmin(req)
    ? projects
    : projects.filter((project) => project.members.includes(req.user._id));

module.exports = {
  filteredProjects,
};
