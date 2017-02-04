const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

BlogPosts.create('Test Title 1', 'Test Content 1', 'Test Author 1')
BlogPosts.create('Test Title 2', 'Test Content 2', 'Test Author 2')

router.get('/:id', (req, res) => res.json(BlogPosts.get(req.params.id)));
router.get('/', (req, res) => res.json(BlogPosts.get()));

router.post('/', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author'];
	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if(!(field in req.body)) {
			const message = `Cannot create, required field ${field} missing from body`;
			return res.status(400).send(message);
		}
	}

	res.json(BlogPosts.create(req.body.title, req.body.content, req.body.author));
})

router.delete('/:id', (req, res) => {
	const message = (`Deleting item: ${req.params.id}`);
	BlogPosts.delete(req.params.id);
	res.status(202).end();
})

router.put('/:id', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author', 'id'];
	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if(!(field in req.body)) {
			const message = `Cannot update, required field ${field} missing from body`;
			return res.status(400).send(message);
		}
		if(req.params.id !== req.body.id) {
			const message = `Id paramater: ${req.params.id} must match Id in body: ${req.body.id}.`
			return res.status(400).send(message);
		}
	}
	const updatedItem = {
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		id: req.body.id
	}
	if (req.body.publishDate !== undefined) {
		updatedItem.publishDate = req.body.publishDate
	
	}
	res.json(BlogPosts.update(updatedItem))
})



module.exports = router;