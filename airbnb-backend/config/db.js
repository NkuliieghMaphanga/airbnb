/**
 * db.js — MongoDB connection helper.
 *
 * Connects to MongoDB Atlas (or a local instance) using the URI in the
 * MONGO_URI environment variable.  Called once at server startup in server.js.
 * Exits the process on failure because the API cannot operate without a DB.
 */
const mongoose = require('mongoose');

/**
 * Connects to MongoDB using the connection string in process.env.MONGO_URI.
 * Exits the process if the connection fails, since the API cannot function
 * without a database connection.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
