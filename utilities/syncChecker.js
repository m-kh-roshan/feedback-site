const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { sequelize } = require("../models");

const MODELS_DIR = path.join(__dirname, "../models");
const HASH_FILE = path.join(__dirname, ".lastModelsHash");

function generateModelsHash() {
  const files = fs.readdirSync(MODELS_DIR);
  const hash = crypto.createHash("sha256");
  for (const file of files) {
    const content = fs.readFileSync(path.join(MODELS_DIR, file));
    hash.update(content);
  }
  return hash.digest("hex");
}

/**
 * بررسی اینکه مدل‌ها تغییر کردند یا نه
 */
async function smartSync() {
  const newHash = generateModelsHash();
  let oldHash = null;

  if (fs.existsSync(HASH_FILE)) {
    oldHash = fs.readFileSync(HASH_FILE, "utf8");
  }

  if (newHash !== oldHash) {
    console.log("Model changes detected — syncing with alter...");
    await sequelize.sync({ alter: true });
    fs.writeFileSync(HASH_FILE, newHash);
    console.log("Database synced and hash updated.");
  } else {
    console.log("No model changes — normal sync.");
    await sequelize.sync();
  }
}

module.exports = { smartSync };
