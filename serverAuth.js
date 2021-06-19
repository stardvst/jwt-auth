const express = require('express');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const app = express();
app.use(express.json());

let refreshTokens = [];

const generateAccessToken = user => {
  return jwt.sign(user, process.env.SECRET_TOKEN, { expiresIn: '15s' });
};

app.post('/token', (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) {
    res.sendStatus(401);
  }

  if (!refreshTokens.includes(refreshToken)) {
    res.sendStatus(403);
  }

  try {
    const user = jwt.verify(refreshToken, process.env.REFRESH_SECRET_TOKEN);
    const accessToken = generateAccessToken({ name: user.name }); // to discard iat from user
    res.json({ accessToken });
  } catch (error) {
    res.sendStatus(403);
  }
});

app.post('/login', (req, res) => {
  // authenticate user

  const username = req.body.username;
  const user = { name: username };

  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_SECRET_TOKEN);
  refreshTokens.push(refreshToken);

  res.json({ accessToken, refreshToken });
});

app.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token);
  res.sendStatus(204);
});

app.listen(4001);
