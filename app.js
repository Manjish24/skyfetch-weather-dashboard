// Your OpenWeatherMap API Key
const API_KEY = '9bd2e99b88a9e10c00d201648d10d372';  // Replace with your actual API key
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Function to fetch weather data
async function getWeather(city) {
    // Before making the request, show a loading indicator
    showLoading();

    // Disable search button while loading
    if (searchBtn) {
        searchBtn.disabled = true;
        searchBtn.textContent = 'Searching...';
    }

    // Build the API URL
    const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;

    // Wrap call in try/catch for async/await
    try {
        const response = await axios.get(url);
        // Log the response for debugging
        console.log('Weather Data:', response.data);

        // Pass the data to the display function
        displayWeather(response.data);
    } catch (error) {
        // Log error for debugging
        console.error('Error fetching weather:', error);

        // Show appropriate message based on error type
        if (error.response && error.response.status === 404) {
            showError('City not found. Please check the spelling and try again.');
        } else {
            showError('Something went wrong. Please try again later.');
        }
    } finally {
        // Re-enable button and restore text
        if (searchBtn) {
            searchBtn.disabled = false;
            searchBtn.textContent = '🔍 Search';
        }
    }
}

// Function to display weather data
function displayWeather(data) {
    // Extract the data we need
    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    
    // Create HTML to display
    const weatherHTML = `
        <div class="weather-info">
            <h2 class="city-name">${cityName}</h2>
            <img src="${iconUrl}" alt="${description}" class="weather-icon">
            <div class="temperature">${temperature}°C</div>
            <p class="description">${description}</p>
        </div>
    `;
    
    // Put it on the page
    document.getElementById('weather-display').innerHTML = weatherHTML;

    // Focus back on the input for quick next search
    if (cityInput) {
        cityInput.focus();
    }
}

// Utility to present errors to the user
function showError(message) {
    // Create styled error HTML
    const errorHTML = `
        <div class="error-message">
            <p>❌ <strong>Error:</strong></p>
            <p>${message}</p>
        </div>
    `;

    // Display inside the weather container
    document.getElementById('weather-display').innerHTML = errorHTML;
}

// Utility to show a loading indicator
function showLoading() {
    const loadingHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
    `;
    document.getElementById('weather-display').innerHTML = loadingHTML;
}

// Call the function when page loads
// getWeather('London');  // removed default request

// Show a welcome prompt instead
document.getElementById('weather-display').innerHTML = `
    <div class="welcome-message">
        <p>Enter a city name to get started!</p>
    </div>
`;

// TODO: Get references to HTML elements
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');

// TODO: Add click event listener to search button
searchBtn.addEventListener('click', function() {
    // Get city name from input and trim spaces
    const city = cityInput.value.trim();

    // Validation rules
    if (!city) {
        showError('Please enter a city name.');
        return;
    }
    if (city.length < 2) {
        showError('City name too short.');
        return;
    }

    // Proceed with search
    getWeather(city);
});

// BONUS TODO: Add enter key support
cityInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        const city = cityInput.value.trim();
        if (!city) {
            showError('Please enter a city name.');
            return;
        }
        if (city.length < 2) {
            showError('City name too short.');
            return;
        }
        getWeather(city);
    }
});