document.addEventListener('DOMContentLoaded', () => {
  // Get references to HTML elements by their IDs
  const cityInput = document.getElementById('city-input');
  const searchBtn = document.getElementById('search-btn');
  const locationBtn = document.getElementById('location-btn');
  const weatherDisplay = document.getElementById('weather-display');
  const forecastContainer = document.getElementById('forecast-container');
  const errorElement = document.getElementById('error-message');

  // Elements for displaying weather details
  const cityName = document.getElementById('city-name');
  const temperature = document.getElementById('temperature');
  const weatherIcon = document.getElementById('weather-icon');
  const weatherDescription = document.getElementById('weather-description');
  const humidity = document.getElementById('humidity');
  const windSpeed = document.getElementById('wind-speed');
  const feelsLike = document.getElementById('feels-like');

  // Base URL for API requests
  const API_BASE_URL = 'http://localhost:3000';

  // Modified fetchWeather function with correct base URL
  async function fetchWeather(endpoint, params) {
    try {
      const query = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}${endpoint}?${query}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch data');
      }
      
      return await response.json();
    } catch (error) {
      showError(error.message);
      throw error;
    }
  }

  // Rest of your functions remain the same (updateCurrentWeather, updateForecast, showError)
  function updateCurrentWeather(data) {
    cityName.textContent = `${data.name}, ${data.sys?.country || ''}`;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherDescription.textContent = data.weather[0].description;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
  }

  function updateForecast(data) {
    forecastContainer.innerHTML = '';
    const dailyData = data.list.filter((_, index) => index % 8 === 0);

    dailyData.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dayElement = document.createElement('div');
      dayElement.className = 'forecast-day';
      dayElement.innerHTML = `
        <div>${date.toLocaleDateString('en', { weekday: 'short' })}</div>
        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png">
        <div>${Math.round(item.main.temp_max)}°/${Math.round(item.main.temp_min)}°</div>
      `;
      forecastContainer.appendChild(dayElement);
    });
  }

  function showError(message) {
    errorElement.textContent = message;
    setTimeout(() => errorElement.textContent = '', 5000);
  }

  // Modified handlers with proper error handling
  async function handleSearch() {
    const city = cityInput.value.trim();
    if (!city) return;
    
    try {
      const [current, forecast] = await Promise.all([
        fetchWeather('/api/weather', { city }),
        fetchWeather('/api/forecast', { city })
      ]);
      
      updateCurrentWeather(current);
      updateForecast(forecast);
    } catch (error) {
      console.error('Search error:', error);
    }
  }

  async function handleLocation() {
    if (!navigator.geolocation) {
      showError('Geolocation not supported');
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude: lat, longitude: lon } = position.coords;
          const [current, forecast] = await Promise.all([
            fetchWeather('/api/weather', { lat, lon }),
            fetchWeather('/api/forecast', { lat, lon })
          ]);
          
          updateCurrentWeather(current);
          updateForecast(forecast);
          cityInput.value = current.name;
        } catch (error) {
          console.error('Location error:', error);
          showError('Failed to get location weather');
        }
      },
      (error) => showError(`Location access denied: ${error.message}`)
    );
  }

  // Event listeners
  searchBtn.addEventListener('click', handleSearch);
  locationBtn.addEventListener('click', handleLocation);
  cityInput.addEventListener('keypress', (e) => e.key === 'Enter' && handleSearch());

  // Optional: Load default city on startup
  // handleSearch(); // Only enable if you want this behavior
});
