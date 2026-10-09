// =========================================================
// MOVIEVERSE - MOVIE API MODULE
// OMDb API
// =========================================================

const API_KEY = "6b50d5c1";

const API_URL = "https://www.omdbapi.com/";

// Search movies by title
export const searchMovies = async (movieTitle, page = 1) => {
    try {
        const url =
            `${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(movieTitle)}&type=movie&page=${page}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Unable to connect to the movie API.");
        }

        const data = await response.json();

        if (data.Response === "False") {
            throw new Error(data.Error || "Movie not found.");
        }

        return data;

    } catch (error) {
        throw error;
    }
};


// Get complete details of one movie
export const getMovieDetails = async (imdbID) => {
    try {
        const url =
            `${API_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Unable to fetch movie details.");
        }

        const data = await response.json();

        if (data.Response === "False") {
            throw new Error(data.Error || "Movie details not found.");
        }

        return data;

    } catch (error) {
        throw error;
    }
};