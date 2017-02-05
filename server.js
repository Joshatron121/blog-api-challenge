const express = require('express');
const morgan = require('morgan');

const app = express();

const blogRouter = require('./blogRouter')

app.use(morgan('common'));

// Rout all traffic from blog-posts to blogRouter
app.use('/blog-posts', blogRouter);

function runServer(){
	const port = process.env.PORT || 8080;
	return new Promise((resolve, reject) => {
		app.listen(port, () => {
			console.log(`Your app is running on port: ${port}`);
			resolve();
		})
		.on('error', err => {
			reject(err);
		})
	});
};

let server;

function runServer(){
	const port = process.env.PORT || 8080;
	return new Promise((resolve, reject) => {
		server = app.listen(port, () => {
			console.log(`Your app is listening on port: ${port}`);
			resolve();
		})
		.on('error', err => {
			reject(err);
		})
	});
}

function closeServer(){
	return new Promise((resolve, reject) => {
		console.log('Closing Server');
		server.close(err => {
			if(err) {
				reject(err);
				return;
			}
			resolve();
		})
	})
}

if (require.main === module) {
	runServer().catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer}