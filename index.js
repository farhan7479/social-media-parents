
const express = require('express');
const connectDB = require('./config/conn.js'); 
const parentRoutes = require('./routes/parentRoute.js'); 
const postRoutes = require('./routes/postRoute.js');
const dotenv = require('dotenv'); 

dotenv.config(); 

const app = express();
app.use(express.json());


connectDB(); 


app.use('/api/parents', parentRoutes);

app.use('/api/posts' , postRoutes)


const PORT = process.env.PORT || 8070;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
