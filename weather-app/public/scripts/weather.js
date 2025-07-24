document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const cityInput = document.getElementById('city-input');
  const searchBtn = document.getElementById('search-btn');
  const locationBtn = document.getElementById('location-btn');
  const weatherDisplay = document.getElementById('weather-display');
  const forecastContainer = document.getElementById('forecast-container');
  const errorElement = document.getElementById('error-message');
  const cityName = document.getElementById('city-name');
  const temperature = document.getElementById('temperature');
  const weatherIcon = document.getElementById('weather-icon');
  const weatherDescription = document.getElementById('weather-description');
  const humidity = document.getElementById('humidity');
  const windSpeed = document.getElementById('wind-speed');
  const feelsLike = document.getElementById('feels-like');

  // Fetch Weather Data
  async function fetchWeather(endpoint, params) {
    try {
      const query = new URLSearchParams(params).toString();
      const response = await fetch(`http://localhost:3000${endpoint}?${query}`);
      
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

  // Update UI
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
    
    // Group by day (simplified example)
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

  // Event Handlers
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
      console.error('Error:', error);
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
        }
      },
      (error) => showError(`Location access denied: ${error.message}`)
    );
  }

  // Event Listeners
  searchBtn.addEventListener('click', handleSearch);
  locationBtn.addEventListener('click', handleLocation);
  cityInput.addEventListener('keypress', (e) => e.key === 'Enter' && handleSearch());

  // Initialize with default city
  handleSearch();
});
