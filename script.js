// DOM Elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const celsiusBtn = document.getElementById('celsius');
const fahrenheitBtn = document.getElementById('fahrenheit');
const cityName = document.getElementById('city-name');
const dateTime = document.getElementById('date-time');
const weatherIcon = document.getElementById('weather-icon');
const weatherDescription = document.getElementById('weather-description');
const temperature = document.getElementById('temperature');
const feelsLike = document.getElementById('feels-like');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const pressure = document.getElementById('pressure');
const visibility = document.getElementById('visibility');
const weatherContainer = document.querySelector('.weather-container');
const loadingContainer = document.querySelector('.loading');
const errorContainer = document.querySelector('.error-container');
const errorMessage = document.getElementById('error-message');

// API Key - In a real application, this should be stored securely
// For a demo app, we'll keep it here, but be aware of API usage limits
const API_KEY = 'e3c5f21bb4546bc2ff83e5af4a237bbf'; // Replace with your actual API key

// Default units
let units = 'metric'; // 'metric' for Celsius, 'imperial' for Fahrenheit

// Add event listeners
searchBtn.addEventListener('click', fetchWeatherData);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetchWeatherData();
    }
});
celsiusBtn.addEventListener('click', () => setUnits('metric'));
fahrenheitBtn.addEventListener('click', () => setUnits('imperial'));

// Function to toggle between Celsius and Fahrenheit
function setUnits(unit) {
    if (units === unit) return;
    
    units = unit;
    
    if (unit === 'metric') {
        celsiusBtn.classList.add('active');
        fahrenheitBtn.classList.remove('active');
    } else {
        celsiusBtn.classList.remove('active');
        fahrenheitBtn.classList.add('active');
    }
    
    // If weather data is already displayed, update it
    if (!weatherContainer.classList.contains('hide')) {
        fetchWeatherData();
    }
}

// Function to fetch weather data
async function fetchWeatherData() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showError('Please enter a city name');
        return;
    }
    
    // Show loading spinner
    weatherContainer.classList.add('hide');
    errorContainer.classList.add('hide');
    loadingContainer.classList.remove('hide');
    
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error(response.status === 404 
                ? 'City not found. Please check the spelling.' 
                : 'An error occurred. Please try again.');
        }
        
        const data = await response.json();
        displayWeatherData(data);
    } catch (error) {
        showError(error.message);
    } finally {
        loadingContainer.classList.add('hide');
    }
}

// Function to display weather data
function displayWeatherData(data) {
    // Update city name
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    
    // Update date and time
    const date = new Date();
    dateTime.textContent = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Update weather icon and description
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherDescription.textContent = data.weather[0].description;
    
    // Update temperature and feels like
    const tempSymbol = units === 'metric' ? '°C' : '°F';
    temperature.textContent = `${Math.round(data.main.temp)}${tempSymbol}`;
    feelsLike.textContent = `Feels like: ${Math.round(data.main.feels_like)}${tempSymbol}`;
    
    // Update weather details
    humidity.textContent = `${data.main.humidity}%`;
    
    const windSpeedUnit = units === 'metric' ? 'm/s' : 'mph';
    windSpeed.textContent = `${data.wind.speed} ${windSpeedUnit}`;
    
    pressure.textContent = `${data.main.pressure} hPa`;
    
    const visibilityValue = data.visibility / 1000; // Convert from meters to kilometers
    visibility.textContent = units === 'metric' 
        ? `${visibilityValue.toFixed(1)} km` 
        : `${(visibilityValue * 0.621371).toFixed(1)} mi`;
    
    // Change background based on weather condition
    changeBackground(data.weather[0].main);
    
    // Show weather container
    weatherContainer.classList.remove('hide');
}

// Function to change background based on weather condition
function changeBackground(weatherCondition) {
    document.body.className = ''; // Reset classes
    
    switch (weatherCondition.toLowerCase()) {
        case 'clear':
            document.body.classList.add('clear-sky');
            break;
        case 'clouds':
            document.body.classList.add('clouds');
            break;
        case 'rain':
        case 'drizzle':
            document.body.classList.add('rain');
            break;
        case 'thunderstorm':
            document.body.classList.add('thunderstorm');
            break;
        case 'snow':
            document.body.classList.add('snow');
            break;
        case 'mist':
        case 'fog':
        case 'haze':
            document.body.classList.add('mist');
            break;
        default:
            // Default gradient if no condition matches
            break;
    }
}

// Function to show error message
function showError(message) {
    weatherContainer.classList.add('hide');
    loadingContainer.classList.add('hide');
    errorContainer.classList.remove('hide');
    errorMessage.textContent = message;
}

// Initialize with default city if needed
// Uncomment the following line if you want to load a default city when the page loads
// window.addEventListener('load', () => { cityInput.value = 'London'; fetchWeatherData(); });