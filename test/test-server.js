const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp)

describe('Blog Posts', function(){
	before(function(){
		return runServer();
	});

	after(function() {
		return closeServer();
	});

	it('Should return blog posts on GET', function(){
		return chai.request(app)
			.get('/blog-posts')
			.then(function(res){
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.an.Array;
				res.body.length.should.be.at.least(1)

				const expectedKeys = ['title', 'content', 'author', 'publishDate', 'id']
				res.body.forEach(function(item){
					item.should.be.a('object');
					item.should.include.keys(expectedKeys);
				})
			})
	}) 
	it('Should add a blog post on POST', function(){
		const newItem = {
			title: 'Test Title 3',
			content: 'Test Content 3',
			author: 'Test Author 3'
		}
		return chai.request(app)
			.post('/blog-posts')
			.send(newItem)
			.then(function(res){
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.an('object');
				res.body.should.include.keys(
					'title', 'content', 'author', 'publishDate', 'id');
				res.body.should.deep.equal(Object.assign(newItem, {id: res.body.id, publishDate: res.body.publishDate}))
			})
	})
	it('Should update a blog post on PUT', function(){
		const updatedItem = {
			title: 'Updated Title 1',
			content: 'Updated Content 1',
			author: 'Updated Author 1'
		}
		return chai.request(app)
			.get('/blog-posts')
			.then(function(res){
				updatedItem.id = res.body[0].id;
				updatedItem.publishDate = res.body[0].publishDate;
				return chai.request(app)
					.put(`/blog-posts/${updatedItem.id}`)
					.send(updatedItem)
			})
			.then(function(res){
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.an('object');
				res.body.should.include.keys(
					'title', 'content', 'author', 'publishDate', 'id');
				res.body.should.deep.equal(updatedItem)
			})
	})

	it('Should delete an item on DELETE', function(){
		return chai.request(app)
			.get('/blog-posts')
			.then(function(res){
				return chai.request(app)
					.delete(`/blog-posts/${res.body[0].id}`)

			})
			.then(function(res){
				res.should.have.status(202)
			})
	})
})