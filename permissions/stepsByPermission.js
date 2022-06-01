function filteredSteps(req, steps) {
  if (req.user.role === "Admin" || req.user.role === "Projektleiter") {
    return steps;
  }
  if (req.user.role === "Verkauf") {
    return steps.filter((step) => ["Projektstart"].includes(step.name));
  }
  if (req.user.role === "Chef-Monteur") {
    return steps.filter((step) => ["Montage"].includes(step.name));
  }
  if (req.user.role === "Service-Monteur") {
    return steps.filter((step) =>
      ["Montage", "Inbetriebnahme"].includes(step.name)
    );
  }
  if (req.user.role === "Sachbearbeiter Finanz und Controlling") {
    return steps.filter((step) =>
      ["Projektplanung", "Projektabschluss"].includes(step.name)
    );
  }
  if (req.user.role === "Lagerist") {
    return steps.filter((step) => ["Beschaffung"].includes(step.name));
  }
}

module.exports = {
  filteredSteps,
};
