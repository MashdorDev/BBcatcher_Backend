const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.get('/download', (req, res) => {
  const filePath = path.join(__dirname, './public/0ecd3cda2dd64a7bb116-0.0.3.xpi');
  console.log(`Serving file from ${filePath}`);

  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'application/x-xpinstall');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.sendFile(filePath);
  } else {
    console.log(`File not found: ${filePath}`);
    res.status(404).send('File not found');
  }
});

app.listen(port, () => {
  console.log(`Extension server running at http://localhost:${port}/`);
});
