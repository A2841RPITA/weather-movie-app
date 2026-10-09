// =========================================================
// MOVIEVERSE - MOVIE SEARCH APP
// MAIN JAVASCRIPT FILE
// =========================================================

import {
    searchMovies,
    getMovieDetails
} from "./movie.js";


// =========================================================
// DOM ELEMENTS
// =========================================================

const movieForm = document.getElementById("movieForm");
const movieInput = document.getElementById("movieInput");

const searchButton = document.getElementById("searchButton");
const clearButton = document.getElementById("clearButton");

const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const errorText = document.getElementById("errorText");

const welcomeMessage = document.getElementById("welcomeMessage");

const movieResults = document.getElementById("movieResults");
const movieGrid = document.getElementById("movieGrid");
const resultCount = document.getElementById("resultCount");

const sortSelect = document.getElementById("sortSelect");
const loadMoreButton = document.getElementById("loadMoreButton");

const movieModal = document.getElementById("movieModal");
const closeModal = document.getElementById("closeModal");
const movieDetails = document.getElementById("movieDetails");

const favoritesSection = document.getElementById("favoritesSection");
const favoritesGrid = document.getElementById("favoritesGrid");

const themeButton = document.getElementById("themeButton");


// =========================================================
// VARIABLES
// =========================================================

let currentMovies = [];
let currentSearch = "";
let currentPage = 1;
let totalResults = 0;


// =========================================================
// INITIALIZE APP
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
    loadFavorites();
    loadTheme();
});


// =========================================================
// SHOW / HIDE LOADING
// =========================================================

const showLoading = () => {
    loading.classList.remove("hidden");
};

const hideLoading = () => {
    loading.classList.add("hidden");
};


// =========================================================
// SHOW ERROR
// =========================================================

const showError = (message) => {
    errorText.textContent = message;
    errorMessage.classList.remove("hidden");
};

const hideError = () => {
    errorMessage.classList.add("hidden");
};


// =========================================================
// SEARCH MOVIES
// =========================================================

const handleMovieSearch = async (event) => {

    event.preventDefault();

    const movieTitle = movieInput.value.trim();

    if (!movieTitle) {
        showError("Please enter a movie name.");
        return;
    }

    currentSearch = movieTitle;
    currentPage = 1;
    currentMovies = [];

    hideError();
    welcomeMessage.classList.add("hidden");
    movieResults.classList.add("hidden");
    showLoading();

    searchButton.disabled = true;

    try {

        const data = await searchMovies(movieTitle, currentPage);

        currentMovies = data.Search || [];
        totalResults = Number(data.totalResults) || currentMovies.length;

        displayMovies();

        movieResults.classList.remove("hidden");

        updateResultCount();

        updateLoadMoreButton();

    } catch (error) {

        showError(
            error.message || "Something went wrong. Please try again."
        );

        movieResults.classList.add("hidden");

    } finally {

        hideLoading();
        searchButton.disabled = false;
    }
};


// =========================================================
// DISPLAY MOVIES
// =========================================================

const displayMovies = () => {

    movieGrid.innerHTML = "";

    if (currentMovies.length === 0) {
        showError("No movies found.");
        return;
    }

    currentMovies.forEach((movie, index) => {

        const movieCard = createMovieCard(movie, index);

        movieGrid.appendChild(movieCard);
    });
};


// =========================================================
// CREATE MOVIE CARD
// =========================================================

const createMovieCard = (movie, index = 0) => {

    const card = document.createElement("div");

    card.className = "movie-card";

    card.style.animationDelay = `${index * 0.05}s`;

    const poster =
        movie.Poster && movie.Poster !== "N/A"
            ? movie.Poster
            : "https://via.placeholder.com/300x450?text=No+Poster";

    const isFavorite = isMovieFavorite(movie.imdbID);

    card.innerHTML = `
        <img
            src="${poster}"
            alt="${movie.Title} poster"
            class="movie-poster"
        >

        <div class="poster-overlay">
            <button
                type="button"
                class="details-button"
                data-id="${movie.imdbID}"
            >
                View Details
            </button>
        </div>

        <button
            type="button"
            class="favorite-button"
            data-favorite-id="${movie.imdbID}"
            title="Add to favorites"
        >
            ${isFavorite ? "❤️" : "♡"}
        </button>

        <div class="movie-info">

            <h3 class="movie-title">
                ${movie.Title}
            </h3>

            <div class="movie-meta">
                <span>
                    📅 ${movie.Year}
                </span>

                <span class="movie-rating">
                    🎬 ${movie.Type}
                </span>
            </div>

        </div>
    `;

    const detailsButton =
        card.querySelector(".details-button");

    detailsButton.addEventListener("click", () => {
        openMovieDetails(movie.imdbID);
    });


    const favoriteButton =
        card.querySelector(".favorite-button");

    favoriteButton.addEventListener("click", () => {

        toggleFavorite(movie);

        favoriteButton.innerHTML =
            isMovieFavorite(movie.imdbID)
                ? "❤️"
                : "♡";

        loadFavorites();
    });


    return card;
};


// =========================================================
// UPDATE RESULT COUNT
// =========================================================

const updateResultCount = () => {

    const count = currentMovies.length;

    if (count === 1) {
        resultCount.textContent = "1 movie";
    } else {
        resultCount.textContent =
            `${count} movies`;
    }
};


// =========================================================
// LOAD MORE MOVIES
// =========================================================

const loadMoreMovies = async () => {

    currentPage++;

    loadMoreButton.disabled = true;
    loadMoreButton.textContent = "Loading...";

    try {

        const data =
            await searchMovies(
                currentSearch,
                currentPage
            );

        const newMovies =
            data.Search || [];

        currentMovies = [
            ...currentMovies,
            ...newMovies
        ];

        displayMovies();

        updateResultCount();

        updateLoadMoreButton();

    } catch (error) {

        showError(
            error.message ||
            "Unable to load more movies."
        );

        currentPage--;

    } finally {

        loadMoreButton.disabled = false;
        loadMoreButton.textContent =
            "Load More Movies";
    }
};


// =========================================================
// LOAD MORE BUTTON
// =========================================================

const updateLoadMoreButton = () => {

    if (currentMovies.length < totalResults) {
        loadMoreButton.classList.remove("hidden");
    } else {
        loadMoreButton.classList.add("hidden");
    }
};


// =========================================================
// MOVIE DETAILS MODAL
// =========================================================

const openMovieDetails = async (imdbID) => {

    showLoading();

    try {

        const movie =
            await getMovieDetails(imdbID);

        renderMovieDetails(movie);

        movieModal.classList.remove("hidden");

        document.body.style.overflow = "hidden";

    } catch (error) {

        showError(
            error.message ||
            "Unable to load movie details."
        );

    } finally {

        hideLoading();
    }
};


// =========================================================
// RENDER MOVIE DETAILS
// =========================================================

const renderMovieDetails = (movie) => {

    const poster =
        movie.Poster && movie.Poster !== "N/A"
            ? movie.Poster
            : "https://via.placeholder.com/300x450?text=No+Poster";


    movieDetails.innerHTML = `
        <div class="movie-details-content">

            <div>
                <img
                    src="${poster}"
                    alt="${movie.Title} poster"
                    class="movie-details-poster"
                >
            </div>

            <div>

                <h2>${movie.Title}</h2>

                <div class="movie-details-info">

                    <span class="detail-tag">
                        📅 ${movie.Year}
                    </span>

                    <span class="detail-tag">
                        ⭐ ${movie.imdbRating || "N/A"}
                    </span>

                    <span class="detail-tag">
                        ⏱️ ${movie.Runtime || "N/A"}
                    </span>

                    <span class="detail-tag">
                        🎬 ${movie.Genre || "N/A"}
                    </span>

                    <span class="detail-tag">
                        🔞 ${movie.Rated || "N/A"}
                    </span>

                </div>

                <p class="movie-plot">
                    ${movie.Plot || "No plot information available."}
                </p>

                <div class="movie-extra-info">

                    <div class="extra-item">
                        <span>Director</span>
                        <strong>
                            ${movie.Director || "N/A"}
                        </strong>
                    </div>

                    <div class="extra-item">
                        <span>Actors</span>
                        <strong>
                            ${movie.Actors || "N/A"}
                        </strong>
                    </div>

                    <div class="extra-item">
                        <span>Released</span>
                        <strong>
                            ${movie.Released || "N/A"}
                        </strong>
                    </div>

                    <div class="extra-item">
                        <span>Language</span>
                        <strong>
                            ${movie.Language || "N/A"}
                        </strong>
                    </div>

                    <div class="extra-item">
                        <span>Country</span>
                        <strong>
                            ${movie.Country || "N/A"}
                        </strong>
                    </div>

                    <div class="extra-item">
                        <span>IMDb Votes</span>
                        <strong>
                            ${movie.imdbVotes || "N/A"}
                        </strong>
                    </div>

                </div>

            </div>

        </div>
    `;
};


// =========================================================
// CLOSE MODAL
// =========================================================

const closeMovieModal = () => {

    movieModal.classList.add("hidden");

    document.body.style.overflow = "auto";
};


// =========================================================
// FAVORITES
// =========================================================

const getFavorites = () => {

    return JSON.parse(
        localStorage.getItem("movieFavorites")
    ) || [];
};


const saveFavorites = (favorites) => {

    localStorage.setItem(
        "movieFavorites",
        JSON.stringify(favorites)
    );
};


const isMovieFavorite = (imdbID) => {

    const favorites = getFavorites();

    return favorites.some(
        movie => movie.imdbID === imdbID
    );
};


// =========================================================
// ADD / REMOVE FAVORITE
// =========================================================

const toggleFavorite = (movie) => {

    let favorites = getFavorites();

    const alreadyFavorite =
        favorites.some(
            item => item.imdbID === movie.imdbID
        );


    if (alreadyFavorite) {

        favorites =
            favorites.filter(
                item => item.imdbID !== movie.imdbID
            );

    } else {

        favorites.push(movie);
    }


    saveFavorites(favorites);
};


// =========================================================
// DISPLAY FAVORITES
// =========================================================

const loadFavorites = () => {

    const favorites = getFavorites();

    favoritesGrid.innerHTML = "";

    if (favorites.length === 0) {

        favoritesSection.classList.add("hidden");

        return;
    }


    favoritesSection.classList.remove("hidden");


    favorites.forEach((movie, index) => {

        const card =
            createMovieCard(movie, index);

        favoritesGrid.appendChild(card);
    });
};


// =========================================================
// CLEAR SEARCH
// =========================================================

const clearSearch = () => {

    movieInput.value = "";

    clearButton.classList.add("hidden");

    movieInput.focus();

    hideError();
};


// =========================================================
// SHOW / HIDE CLEAR BUTTON
// =========================================================

const updateClearButton = () => {

    if (movieInput.value.trim()) {

        clearButton.classList.remove("hidden");

    } else {

        clearButton.classList.add("hidden");
    }
};


// =========================================================
// SEARCH SUGGESTIONS
// =========================================================

const suggestionButtons =
    document.querySelectorAll(".suggestion-button");


suggestionButtons.forEach(button => {

    button.addEventListener("click", () => {

        const movieName =
            button.dataset.movie;

        movieInput.value = movieName;

        updateClearButton();

        movieForm.dispatchEvent(
            new Event("submit")
        );
    });
});


// =========================================================
// SORT MOVIES
// =========================================================

const sortMovies = () => {

    const sortValue = sortSelect.value;


    if (sortValue === "year") {

        currentMovies.sort(
            (a, b) =>
                Number(b.Year) - Number(a.Year)
        );

    }


    if (sortValue === "title") {

        currentMovies.sort(
            (a, b) =>
                a.Title.localeCompare(b.Title)
        );
    }


    displayMovies();
};


// =========================================================
// THEME BUTTON
// =========================================================

const loadTheme = () => {

    const savedTheme =
        localStorage.getItem("movieTheme");

    if (savedTheme === "light") {

        document.body.classList.add("light-theme");

        themeButton.textContent = "☀️";

    } else {

        themeButton.textContent = "🌙";
    }
};


const toggleTheme = () => {

    document.body.classList.toggle(
        "light-theme"
    );


    const isLight =
        document.body.classList.contains(
            "light-theme"
        );


    localStorage.setItem(
        "movieTheme",
        isLight ? "light" : "dark"
    );


    themeButton.textContent =
        isLight ? "☀️" : "🌙";
};


// =========================================================
// EVENT LISTENERS
// =========================================================

movieForm.addEventListener(
    "submit",
    handleMovieSearch
);


movieInput.addEventListener(
    "input",
    updateClearButton
);


clearButton.addEventListener(
    "click",
    clearSearch
);


loadMoreButton.addEventListener(
    "click",
    loadMoreMovies
);


sortSelect.addEventListener(
    "change",
    sortMovies
);


closeModal.addEventListener(
    "click",
    closeMovieModal
);


document.querySelector(
    ".modal-overlay"
).addEventListener(
    "click",
    closeMovieModal
);


themeButton.addEventListener(
    "click",
    toggleTheme
);


// =========================================================
// ESC KEY CLOSES MODAL
// =========================================================

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            !movieModal.classList.contains("hidden")
        ) {

            closeMovieModal();
        }
    }
);