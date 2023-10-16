const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    console.log('home');
    res.send('Hello World!');
    }
);

app.get('/download', (req, res) => {
    console.log('download');
  const filePath = path.join(__dirname, './public/0ecd3cda2dd64a7bb116-0.0.3.xpi');

  // Make sure the file exists
  if (fs.existsSync(filePath)) {
    // Set Content-Type to application/x-xpinstall for Firefox to recognize it
    res.setHeader('Content-Type', 'application/x-xpinstall');

    // Serve the .xpi file
    res.sendFile(filePath);
  } else {
    res.status(404).send('File not found');
  }
});

app.listen(port, () => {
  console.log(`Extension server running at http://localhost:${port}/`);
});
