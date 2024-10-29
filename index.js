// server.js
const express = require('express');
const connectDB = require('./config/conn.js'); // Use require for conn.js
const parentRoutes = require('./routes/parentRoute.js'); // Assume you have this file
const postRoutes = require('./routes/postRoute.js');
const dotenv = require('dotenv'); // Use require for dotenv

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB(); // Call the function to connect to the database

// Routes
app.use('/api/parents', parentRoutes);

app.use('/api/posts' , postRoutes)

// Start server
const PORT = process.env.PORT || 8070;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
