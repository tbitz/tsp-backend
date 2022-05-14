/**
 * supported roles: Admin, Monteur, Projektleiter
 * toString is changing ObjectId("id") to "id"
 */
function filteredTasks(req, steps, tasks) {
  if (req.user.role === "Admin") {
    return tasks;
  }
  if (req.user.role === "Monteur") {
    const filteredStepIds = steps
      .filter((step) => ["Montage"].includes(step.name))
      .map((step) => step._id.toString());

    return tasks.filter((task) => filteredStepIds.includes(task.stepId));
  }

  if (req.user.role === "Projektleiter") {
    const filteredStepIds = steps
      .filter((step) =>
        [
          "Projektstart",
          "Projektplanung",
          "Beschaffungen",
          "Letzte Vorbereitungen",
          "Projektabschluss",
        ].includes(step.name)
      )
      .map((step) => step._id.toString());

    return tasks.filter((task) => filteredStepIds.includes(task.stepId));
  }
}

module.exports = {
  filteredTasks,
};
