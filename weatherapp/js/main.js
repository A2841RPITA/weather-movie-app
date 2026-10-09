// ==========================================
// MAIN JAVASCRIPT
// ==========================================

// Import weather function
import {
    getWeatherData
} from "./weather.js";

// ==========================================
// DOM ELEMENTS
// ==========================================

const weatherForm =
    document.getElementById("weatherForm");

const cityInput =
    document.getElementById("cityInput");

const loading =
    document.getElementById("loading");

const errorMessage =
    document.getElementById("errorMessage");

const weatherCard =
    document.getElementById("weatherCard");

const welcomeMessage =
    document.getElementById("welcomeMessage");

// Weather information elements

const cityName =
    document.getElementById("cityName");

const weatherCondition =
    document.getElementById("weatherCondition");

const weatherIcon =
    document.getElementById("weatherIcon");

const temperature =
    document.getElementById("temperature");

const humidity =
    document.getElementById("humidity");

const windSpeed =
    document.getElementById("windSpeed");

// ==========================================
// FORM EVENT
// ==========================================

weatherForm.addEventListener(
    "submit",
    handleWeatherSearch
);

// ==========================================
// HANDLE SEARCH
// ==========================================

async function handleWeatherSearch(event) {

    event.preventDefault();

    const city =
        cityInput.value.trim();

    if (!city) {

        showError(
            "Please enter a city name."
        );

        return;
    }

    showLoading();

    try {

        const data =
            await getWeatherData(city);

        displayWeather(data);

    } catch (error) {

        showError(
            error.message
        );

    } finally {

        hideLoading();

    }
}

// ==========================================
// DISPLAY WEATHER
// ==========================================

const displayWeather = (data) => {

    // Destructuring
    const {
        name,
        main,
        weather,
        wind
    } = data;

    const {
        temp,
        humidity: humidityValue
    } = main;

    const {
        description,
        icon
    } = weather[0];

    const {
        speed
    } = wind;

    cityName.textContent =
        name;

    weatherCondition.textContent =
        description;

    temperature.textContent =
        `${Math.round(temp)}°C`;

    humidity.textContent =
        `${humidityValue}%`;

    // Convert m/s to km/h
    const windInKmh =
        (speed * 3.6).toFixed(1);

    windSpeed.textContent =
        `${windInKmh} km/h`;

    weatherIcon.src =
        `https://openweathermap.org/img/wn/${icon}@2x.png`;

    weatherIcon.alt =
        description;

    weatherCard.classList.remove(
        "hidden"
    );

    welcomeMessage.classList.add(
        "hidden"
    );

    errorMessage.classList.add(
        "hidden"
    );
};

// ==========================================
// SHOW LOADING
// ==========================================

const showLoading = () => {

    loading.classList.remove(
        "hidden"
    );

    weatherCard.classList.add(
        "hidden"
    );

    errorMessage.classList.add(
        "hidden"
    );
};

// ==========================================
// HIDE LOADING
// ==========================================

const hideLoading = () => {

    loading.classList.add(
        "hidden"
    );
};

// ==========================================
// SHOW ERROR
// ==========================================

const showError = (message) => {

    errorMessage.textContent =
        message;

    errorMessage.classList.remove(
        "hidden"
    );

    weatherCard.classList.add(
        "hidden"
    );

    welcomeMessage.classList.add(
        "hidden"
    );
};