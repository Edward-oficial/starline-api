const { nanoid } = require("nanoid");

function generateApiKey(prefix = "starline") {
  return `${prefix}-${nanoid(24)}`;
}

module.exports = { generateApiKey };