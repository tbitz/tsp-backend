const { isAdmin } = require("./utils");

const filteredCustomers = (req, customers, eliglibleCustomerIds) =>
  isAdmin(req)
    ? customers
    : customers.filter((customer) =>
        eliglibleCustomerIds.includes(customer._id.toString())
      );

module.exports = {
  filteredCustomers,
};
