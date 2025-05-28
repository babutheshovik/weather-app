// API Configuration
const API_KEY = "3bdfa489231ab66611127ec860cfb40a"; // Your working key

// DOM Elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');

// Initialize App
window.addEventListener('load', () => {
  updateDate();
  fetchWeather("Mumbai"); // Default city to test
});

// Event Listeners
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) fetchWeather(city);
});

cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchBtn.click();
});

// Functions
function updateDate() {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('date').textContent = new Date().toLocaleDateString('en-US', options);
}

async function fetchWeather(city) {
  try {
    // Fetch Current Weather
    const currentResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    
    if (!currentResponse.ok) {
      const error = await currentResponse.json();
      throw new Error(error.message || "Failed to fetch weather");
    }
    
    const currentData = await currentResponse.json();
    updateCurrentWeather(currentData);
    
    // Fetch Forecast (optional)
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );
    const forecastData = await forecastResponse.json();
    updateForecast(forecastData);
    
  } catch (error) {
    console.error("Weather fetch error:", error);
    alert(`Error: ${error.message}\n\nTry:\n• Checking city spelling\n• Using English names`);
  }
}

function updateCurrentWeather(data) {
  if (!data?.main || !data?.weather) return; // Safety check
  
  document.getElementById("location").textContent = 
    `${data.name || "N/A"}, ${data.sys?.country || "N/A"}`;
  
  document.getElementById("temp").textContent = 
    `${Math.round(data.main.temp)}°C`;
  
  document.getElementById("description").textContent = 
    data.weather[0]?.description || "N/A";
  
  document.getElementById("feels-like").textContent = 
    `${Math.round(data.main.feels_like)}°C`;
  
  document.getElementById("humidity").textContent = 
    `${data.main.humidity}%`;
  
  document.getElementById("wind").textContent = 
    `${data.wind?.speed || 0} m/s`;
  
  // Update weather icon
  const icon = document.getElementById("weather-icon");
  if (data.weather[0]?.id) {
    icon.className = `wi ${getWeatherIcon(data.weather[0].id)}`;
  }
}

function updateForecast(data) {
  const forecastList = document.getElementById('forecast-list');
  if (!data?.list) return; // Safety check
  
  forecastList.innerHTML = '';
  
  // Show one entry per day (every 24hrs)
  const dailyData = data.list.filter((_, index) => index % 8 === 0);
  
  dailyData.forEach(day => {
    const date = new Date(day.dt * 1000);
    forecastList.innerHTML += `
      <div class="forecast-day">
        <p>${date.toLocaleDateString('en', { weekday: 'short' })}</p>
        <i class="wi ${getWeatherIcon(day.weather[0]?.id || 800)}"></i>
        <p>${Math.round(day.main?.temp_max)}°/${Math.round(day.main?.temp_min)}°</p>
      </div>
    `;
  });
}

function getWeatherIcon(weatherId) {
  weatherId = weatherId || 800; // Default to sunny
  if (weatherId >= 200 && weatherId < 300) return 'wi wi-thunderstorm';
  if (weatherId >= 300 && weatherId < 600) return 'wi wi-rain';
  if (weatherId >= 600 && weatherId < 700) return 'wi wi-snow';
  if (weatherId >= 700 && weatherId < 800) return 'wi wi-fog';
  if (weatherId === 800) return 'wi wi-day-sunny';
  return 'wi wi-cloudy';
}