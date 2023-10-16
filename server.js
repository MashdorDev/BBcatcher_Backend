const { log } = require('console');
const express = require('express');
const app = express();
const path = require('path');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the .xpi file with the correct Content-Type header
app.get('/updates/BB.xpi', (req, res) => {
    console.log("updates/BB.xpi");
  res.setHeader('Content-Type', 'application/x-xpinstall');
  res.sendFile(path.join(__dirname,'src', 'updates', 'BB.xpi'));
});

// Route to serve installbb.html
app.get('/installBB', (req, res) => {
    console.log("installBB");
  res.sendFile(path.join(__dirname,'public', 'installBB.html'));
});

// Route to handle the GET request and send back the manifest file
app.get('/get-manifest', (req, res) => {
  // Set the path to your manifest.json file
  res.sendFile(path.join(__dirname,'src', 'updates', 'manifest.json'));
});

// Route to serve privacypolicy.html
app.get('/PrivacyPolicy', (req, res) => {
  res.sendFile(path.join(__dirname, 'src','public', 'privacypolicy.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
