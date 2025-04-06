//const API_KEY = '33c2218dc1e767bbf6dde6a87ff9449c';

const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const weatherDescription = document.getElementById('weather-description');
const weatherIcon = document.getElementById('weather-icon');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const forecastContainer = document.getElementById('forecast-container');
const dateElement = document.getElementById('date');

async function fetchWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`);
        const data = await response.json();

        if (data.cod !== 200) {
            alert('City not found!');
            return;
        }

        updateWeatherUI(data);
        fetchForecast(city);
    } catch (error) {
        alert('Error fetching weather data. Try again later.');
    }
}

function updateWeatherUI(data) {
    cityName.textContent = data.name;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} km/h`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherIcon.style.display = 'block';

    const now = new Date();
    dateElement.textContent = now.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

async function fetchForecast(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`);
        const data = await response.json();

        if (data.cod !== "200") {
            alert("Error fetching forecast data.");
            return;
        }

        displayForecast(data.list);
    } catch (error) {
        alert("Error fetching forecast. Try again later.");
    }
}

function displayForecast(forecast) {
    forecastContainer.innerHTML = '';
    let dailyData = {};

    forecast.forEach(entry => {
        const date = new Date(entry.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'long' });

        if (!dailyData[day]) {
            dailyData[day] = entry;
        }
    });

    Object.values(dailyData).slice(0, 7).forEach(day => {
        const card = document.createElement('div');
        card.classList.add('forecast-card');
        card.innerHTML = `
      <p>${new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="Weather Icon">
      <p>${Math.round(day.main.temp)}°C</p>
    `;
        forecastContainer.appendChild(card);
    });
}

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) fetchWeather(city);
});
