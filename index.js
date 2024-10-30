
const express = require('express');
const connectDB = require('./config/conn.js'); 
const parentRoutes = require('./routes/parentRoute.js'); 
const postRoutes = require('./routes/postRoute.js');
const circleRoutes = require('./routes/circleRoute.js');
const dotenv = require('dotenv'); 
const morgan = require('morgan');
dotenv.config(); 

const app = express();
app.use(express.json());


connectDB(); 

app.use(morgan('combined'));
app.use('/api/parents', parentRoutes);

app.use('/api/posts' , postRoutes);
app.use('/api/circles', circleRoutes);


const PORT = process.env.PORT || 8070;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
