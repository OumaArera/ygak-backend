const sequelize = require('../config/sequelize');

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection successful!");
  } catch (err) {
    console.error("Connection failed:", err);
  }
})();
