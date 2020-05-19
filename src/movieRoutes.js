const express = require('express');
let db = require('./store');

const movieRouter = express.Router();

movieRouter.route('/').get((req, res) => {
	const { genre, country, avg_vote } = req.query;

	let movies = [...db];

	if (genre || country || avg_vote) {
		if (genre) {
			let search = genre.toLowerCase();
			movies = movies.filter((movie) =>
				movie.genre.toLowerCase().includes(search)
			);
		}

		if (country) {
			let search = country.toLowerCase();
			movies = movies.filter((movie) =>
				movie.country.toLowerCase().includes(search)
			);
		}

		if (avg_vote) {
			let search = parseInt(avg_vote);
			movies = movies.filter((movie) => Number(movie.avg_vote) >= search);
		}
	}

	res.status(200).json(movies);
});

module.exports = movieRouter;
