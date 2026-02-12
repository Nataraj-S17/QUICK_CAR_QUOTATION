require('dotenv').config();
const express = require('express');
const cors = require('cors');
const adminRoutes = require('./routes/adminRoutes');
const customerRoutes = require('./routes/customerRoutes');
const carRoutes = require('./routes/carRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/ai', require('./routes/recommendationRoutes'));
app.use('/api/ai', require('./routes/quotationRoutes'));

// Root route for sanity check
app.get('/', (req, res) => {
    res.send('Car Quotation API is running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
