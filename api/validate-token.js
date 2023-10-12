module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    const accessToken = req.query.access_token;
    const validationURL = `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`;
    try {
      const response = await fetch(validationURL, { method: 'GET' });
      const json = await response.json();
      if (json.aud && json.aud === process.env.GOOGLE_CLIENT_ID) {
        res.json(json);
      } else {
        throw new Error("Token validation error");
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };