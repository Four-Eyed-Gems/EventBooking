const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
// const setupSwagger = require("./configs/swagger");

// All routes
const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
const userRoutes = require("./routes/users");
const hallRoutes = require("./routes/halls");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
const uri = process.env.MONGODB_URI; // Using environment variable with a fallback
console.log(uri);
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // Remove useCreateIndex as it's deprecated
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);
app.use("/api/halls", hallRoutes);

// setupSwagger(app);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
