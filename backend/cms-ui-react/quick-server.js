// Simple Express server for quick testing
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3003;

// Enable CORS
app.use(cors());

// Log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle all routes by serving index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Quick server running on http://localhost:${PORT}`);
  console.log(`Test page available at http://localhost:${PORT}/react-test.html`);
}); 