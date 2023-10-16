const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();

const privateKey = fs.readFileSync(path.join(__dirname, './certs/private-key.pem'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, './certs/cert.pem'), 'utf8');

const credentials = { key: privateKey, cert: certificate };

// Serve static files
app.use('/static', express.static(path.join(__dirname, 'static')));

// Endpoint to download the XPI file
app.get('/download', (req, res) => {
  const file = path.join(__dirname, 'static/your-extension.xpi');
  res.download(file);
});

// Endpoint for extension updates
app.get('/update', (req, res) => {
  // Logic to determine if an update is available
  res.json({ updateAvailable: true, version: '2.0.0', url: '/download' });
});

// Create HTTPS server
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(3000, () => {
  console.log('HTTPS Server running on port 3000');
});
