require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const connectDB  = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth',   require('./routes/authRoutes'));
app.use('/api/items',  require('./routes/itemRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// Must be last
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));