const express = require('express');
const morgan = require('morgan');

const app = express();

const blogRouter = require('./blogRouter')

app.use(morgan('common'));

// Rout all traffic from blog-posts to blogRouter
app.use('/blog-posts', blogRouter);

app.listen(process.env.PORT || 8080, () => {
	console.log(`Your app is listening on port ${process.env.PORT || 8080}`)
})