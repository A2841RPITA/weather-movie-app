
const API_KEY = "510073f966a46967ab334847aa1bae4d";

const API_URL =
    "https://api.openweathermap.org/data/2.5/weather";

export async function getWeatherData(city) {
    if (!city || !city.trim()) {
        throw new Error("Please enter a city name.");
    }

    try {
        const url = `${API_URL}?q=${encodeURIComponent(city.trim())}&appid=${API_KEY}&units=metric`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Invalid API key.");
            }

            if (response.status === 404) {
                throw new Error("City not found.");
            }

            throw new Error(
                data.message || "Unable to fetch weather data."
            );
        }

        return data;
    } catch (error) {
        throw error;
    }
}
