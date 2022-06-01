/**
 * supported roles: Admin, Monteur, Projektleiter
 * toString is changing ObjectId("id") to "id"
 */
const filterAllowedSteps = (steps, tasks, allowedSteps) => {
  const filteredStepIds = steps
    .filter((step) => allowedSteps.includes(step.name))
    .map((step) => step._id.toString());
  return tasks.filter((task) => filteredStepIds.includes(task.stepId));
};

function filteredTasks(req, steps, tasks) {
  if (req.user.role === "Admin") {
    return tasks;
  }
  if (req.user.role === "Verkauf")
    return filterAllowedSteps(steps, tasks, ["Projektstart"]);
  if (req.user.role === "Chef-Monteur")
    return filterAllowedSteps(steps, tasks, ["Montage"]);
  if (req.user.role === "Service-Monteur")
    return filterAllowedSteps(steps, tasks, ["Montage", "Inbetriebnahme"]);
  if (req.user.role === "Sachbearbeiter Finanz und Controlling")
    return filterAllowedSteps(steps, tasks, [
      "Projektplanung",
      "Projektabschluss",
    ]);
  if (req.user.role === "Lagerist")
    return filterAllowedSteps(steps, tasks, ["Beschaffung"]);
  if (req.user.role === "Projektleiter")
    return filterAllowedSteps(steps, tasks, [
      "Projektstart",
      "Projektplanung",
      "Beschaffung",
      "Letzte Vorbereitungen",
      "Projektabschluss",
    ]);

  return tasks.filter((task) => filteredStepIds.includes(task.stepId));
}

module.exports = {
  filteredTasks,
};
