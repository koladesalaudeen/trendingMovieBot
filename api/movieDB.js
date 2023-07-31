const fetch = require('node-fetch');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const MovieAPIKey = process.env.MovieAPI;
const IMDBBaseUrl = process.env.IMDBBaseUrl;
const MovieUrl = process.env.MovieUrl;
const TrendingMovieEndPoint = process.env.TrendingMovieEndPoint;

const { CardFactory } = require('botbuilder-core');

const displayTrendingMovies = async (stepContext) => {
    const response = await axios.get(`${TrendingMovieEndPoint}`, {
        params: {
            api_key: `${ MovieAPIKey }`
        }
    });

    const movies = response.data.results.slice(0, 10);

    return movies;
}

const searchMovies = async (stepContext, movieTitle) => {
    const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
        params: {
            api_key: `${ MovieAPIKey }`,
            query: movieTitle
        }
    });

    const movies = response.data.results.slice(0, 1);

    for (const movie of movies) {
        const card = CardFactory.heroCard(
            movie.title,
            movie.overview,
            [{ url: `https://image.tmdb.org/t/p/w200${ movie.poster_path }` }],
            [
                { type: 'openUrl', title: 'View Details', value: `https://www.themoviedb.org/movie/${ movie.id }` }
            ]
        );
        
        const cardMessage = { type: 'message', attachments: [card] };
        await stepContext.context.sendActivity(cardMessage);
    }
}
  
  module.exports.fetchData = fetchData;
  module.exports.findMovie = findMovie;
  module.exports.displayTrendingMovies = displayTrendingMovies;
  module.exports.searchMovies = searchMovies;