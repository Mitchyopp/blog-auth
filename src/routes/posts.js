const express = require('express');
const { Post, User, Category } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const include = [
      { model: User, attributes: ['id', 'username'] },
      { model: Category, attributes: ['id', 'name'] },
    ];
    if (category) {
      include[1].where = { name: category };
    }
    const posts = await Post.findAll({
      include,
      order: [['createdAt', 'DESC']],
    });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'There was a server error.. :(' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['id', 'username'] },
        { model: Category, attributes: ['id', 'name'] },
      ],
    });
    if (!post) return res.status(404).json({ message: 'This post was not found..' });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'There was a server error.. :(' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { title, content, categoryId } = req.body;
    if (!title || !content || !categoryId) {
      return res.status(400).json({ message: 'Missing fields..' });
    }
    const post = await Post.create({
      title,
      content,
      categoryId,
      userId: req.user.id,
    });
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'There was a server error.. :(' });
  }
});
