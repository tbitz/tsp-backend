function filteredSteps(req, steps) {
  if (req.user.role === "Admin") {
    return steps;
  }
  if (req.user.role === "Monteur") {
    return steps.filter((step) => ["Montage"].includes(step.name));
  }

  if (req.user.role === "Projektleiter") {
    return steps.filter((step) =>
      [
        "Projektstart",
        "Projektplanung",
        "Beschaffungen",
        "Letzte Vorbereitungen",
        "Projektabschluss",
      ].includes(step.name)
    );
  }
}

module.exports = {
  filteredSteps,
};
