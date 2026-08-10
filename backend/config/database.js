const mongoose = require('mongoose');

async function connectDatabase(uri) {
  mongoose.set('strictQuery', true);
  mongoose.set('sanitizeFilter', true);
  await mongoose.connect(uri, {
    maxPoolSize: 10,
    minPoolSize: 1,
    serverSelectionTimeoutMS: 5000
  });
}

module.exports = { connectDatabase };
