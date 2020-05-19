require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV, API_TOKEN } = require('./config');
const app = express();
const movieRouter = require('./movieRoutes');
const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

//Middlewares
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

//auth Middleware
app.use(function requireAuth(req, res, next) {
	const authValue = req.get('Authorization') || ' ';

	//verify bearer
	if (!authValue.toLowerCase().startsWith('bearer')) {
		return res.status(400).json({ error: 'Missing bearer token' });
	}

	const token = authValue.split(' ')[1];

	if (token !== API_TOKEN) {
		return res.status(401).json({ error: 'Invalid token' });
	}

	next();
});

//Routes
app.use('/movie', movieRouter);

//Error handler middleware
app.use(function errorHandler(error, req, res, next) {
	let response;
	if (NODE_ENV === 'production') {
		response = { error: { message: 'server error' } };
		res.status(500).json(response);
	}
});

module.exports = app;
