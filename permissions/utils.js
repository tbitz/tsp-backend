const isAdmin = (req) => req.user.role === "Admin";
const isProjektleiter = (req) => req.user.role === "Projektleiter";

module.exports = {
  isAdmin,
  isProjektleiter,
};
