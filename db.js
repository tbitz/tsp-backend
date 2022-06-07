const mongoose = require("mongoose");

module.exports = async () => {
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
    await mongoose.connect(
      process.env.USE_LOCAL_DB
        ? process.env.ATLAS_URI
        : process.env.ATLAS_LIVE_URI,
      connectionParams
    );
    console.log("connected to database successfully");
  } catch (error) {
    console.log("could not connect to database.", error);
  }
};
