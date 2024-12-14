const express = require('express');
const path = require('path');
const app = express();

// Serve static files from React
app.use(express.static(path.join(__dirname, '../frontend/build')));

// API routes go here...

// Serve React app for any other route
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
