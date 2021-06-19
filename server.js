const express = require('express');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const app = express();
app.use(express.json());

const posts = [
  {
    username: 'Kyle',
    title: 'Post 1',
  },
  {
    username: 'Jim',
    title: 'Post 2',
  },
];

const authenticateToken = (req, res, next) => {
  console.log(req.headers, req.body);
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const user = jwt.verify(token, process.env.SECRET_TOKEN);
    req.user = user;
    next();
  } catch (error) {
    return res.sendStatus(403);
  }
};

app.get('/posts', authenticateToken, (req, res) => {
  console.log(posts, req.user);
  res.json(posts.filter(post => post.username === req.user.name));
});

app.listen(3001);
