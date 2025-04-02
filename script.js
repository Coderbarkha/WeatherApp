// const API_KEY = '33c2218dc1e767bbf6dde6a87ff9449c'; 
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const weatherDescription = document.getElementById('weather-description');
const weatherIcon = document.getElementById('weather-icon');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const forecastContainer = document.getElementById('forecast-container');

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
    
    // Show weather icon
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherIcon.style.display = 'block';
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
        let date = new Date(entry.dt * 1000);
        let dayName = date.toLocaleDateString('en-US', { weekday: 'long' }); // Get Day Name

        if (!dailyData[dayName]) {
            dailyData[dayName] = entry;
        }
    });

    Object.values(dailyData).forEach(day => {
        const forecastElement = document.createElement('div');
        forecastElement.classList.add('forecast-card');
        forecastElement.innerHTML = `
            <p>${new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' })}</p>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="Weather Icon">
            <p>${Math.round(day.main.temp)}°C</p>
        `;
        forecastContainer.appendChild(forecastElement);
    });
}


// Event listener for search button
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) fetchWeather(city);
});
