function formatDate(response) {
    let long = response.data.coord.lon;
    let lat = response.data.coord.lat;
    let timestamp = response.data.dt;
    let apiKey = "6aa24761b999470a92c6399feefd0f88";
    let url = `https://api.ipgeolocation.io/timezone?apiKey=${apiKey}&lat=${lat}&long=${long}`;
    axios.get(url).then(displayDate);
}

function displayDate(response) {
    let date = response.data.date_time_txt;
    let date_array = date.split(",");
    let time = response.data.time_12;
    let time_array = time.split("");
    time_array.splice(5, 3);
    if (time_array[0] === "0") {
        time_array.shift();
    }
    time = time_array.join("");
    document.querySelector("#current-date-time").innerHTML = date_array[0] + " " + time;
}

function clickMe(event) {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(getCoordinates);
}

function getCoordinates(position) {
    let coordinates = [position.coords.latitude, position.coords.longitude];
    getCity(coordinates);
}

function getCity(coordinates) {
    let apiKey = "9ed24e5c436afdb265857268e29a26c9";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates[0]}&lon=${coordinates[1]}&appid=${apiKey}&units=imperial`;
    axios.get(apiUrl).then(displayGeo);
}

function displayGeo(response) {
    fTemp = response.data.main.temp;
    document.querySelector("#celsius").classList.remove("active");
    document.querySelector("#fahrenheit").classList.add("active");
    document.querySelector("h1").innerHTML = response.data.name;
    document.querySelector("#current-temp").innerHTML = Math.round(fTemp);
    document.querySelector("#weather").innerHTML = response.data.weather[0].description;
    document.querySelector("#humidity").innerHTML = response.data.main.humidity;
    document.querySelector("#wind").innerHTML = response.data.wind.speed;
    formatDate(response);
    getForecast(response.data.coord);
}

function displaySearch(response) {
    fTemp = response.data.main.temp;
    let icon = response.data.weather[0].icon;
    let timeOfDay = icon[2];
    if (timeOfDay === "n") {
        document.body.style.backgroundColor = "#011E33";
        document.querySelector("p").style.color = "white";
    } else {
        document.body.style.backgroundColor = "#D7E5F0";
        document.querySelector("p").style.color = "black";
        
    }
    document.querySelector("#celsius").classList.remove("active");
    document.querySelector("#fahrenheit").classList.add("active");
    document.querySelector("h1").innerHTML = response.data.name;
    document.querySelector("#current-temp").innerHTML = Math.round(fTemp);
    document.querySelector("#weather").innerHTML = response.data.weather[0].description;
    document.querySelector("#humidity").innerHTML = response.data.main.humidity;
    document.querySelector("#wind").innerHTML = response.data.wind.speed;
    document.querySelector("#current-weather-icon").setAttribute("src", `images/${icon}.svg`)
    getForecast(response);
    formatDate(response);
}

function getForecast(response) {
    let lat = response.data.coord.lat;
    let lon = response.data.coord.lon;
    let apiKey = "9ed24e5c436afdb265857268e29a26c9";
    let apiUrl = "";
    if (temperatureUnit === "Fahrenheit") {
        apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
        temperatureUnit = "Fahrenheit";
    } else {
        apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        temperatureUnit = "Fahrenheit";
    }
    
    axios.get(apiUrl).then(displayForecast);
}

function displayForecast(response) {
    let date = document.querySelector("#current-date-time").innerHTML;
    date = date.split(" ");
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let today = "";
    for (let i = 0; i < days.length; i++) {
        if (days[i] === date[0]) {
            today = i;
        }
    }
    let tomorrow = today + 1;
    let forecastElement = document.querySelector("#forecast");
    let forecastHTML = `<div class="row">`;
    for (let j = 0; j < 5; j++) {
        let icon = response.data.daily[j].weather[0].icon;
        let tempHigh = Math.round(response.data.daily[j].temp.max);
        let tempLow = Math.round(response.data.daily[j].temp.min);
        forecastHTML = forecastHTML + `
            
                <div class="col">
                    <span class="forecast-day">${days[tomorrow + j]}</span><br />
                    <img src="images/${icon}.svg" class="forecast-icon" /><br />
                    <span class="temp-high">${tempHigh}°F</span><span> /</span><span class="temp-low"> ${tempLow}°F</span>
                </div>`;

        forecastElement.innerHTML = forecastHTML;
    }
    forecastElement.innerHTML = forecastHTML + `</div>`;
}

function search(city) {
    let cityName = city;
    let apiKey = "9ed24e5c436afdb265857268e29a26c9";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;
    axios.get(apiUrl).then(displaySearch);
}

function handleSubmit(event) {
    event.preventDefault();
    search(document.querySelector("#search-bar").value);
}

function buttonClick() {
    event.preventDefault();
    let cityName = event.target.id.replace("-", " ");
    document.querySelector("h1").innerHTML = cityName;
    search(cityName);
}

function convertCity(response) {
    let coordinates = [response.data[0].lat, response.data[0].lon];
    getCity(coordinates);
}

function displayCelsius(event) {
    event.preventDefault();
    document.querySelector("#fahrenheit").classList.remove("active");
    document.querySelector("#celsius").classList.add("active");
    document.querySelector("#current-temp").innerHTML = Math.round((fTemp - 32) * 5 / 9);
    temperatureUnit = "Celsius";
    let cityName = document.querySelector("h1").innerHTML;
    let apiKey = "9ed24e5c436afdb265857268e29a26c9";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(getForecast);
}

function displayFahrenheit(event) {
    event.preventDefault();
    document.querySelector("#celsius").classList.remove("active");
    document.querySelector("#fahrenheit").classList.add("active");
    document.querySelector("#current-temp").innerHTML = Math.round(fTemp);
    let cityName = document.querySelector("h1").innerHTML;
    temperatureUnit = "Fahrenheit";
    let apiKey = "9ed24e5c436afdb265857268e29a26c9";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;
    axios.get(apiUrl).then(getForecast);
}

let fTemp = null;

let temperatureUnit = "Fahrenheit";

document.querySelector("#celsius").addEventListener("click", displayCelsius);

document.querySelector("#fahrenheit").addEventListener("click", displayFahrenheit);

document.querySelector("#search-engine").addEventListener("submit", handleSubmit);

document.querySelector("#Paris").addEventListener("click", buttonClick);

document.querySelector("#Sydney").addEventListener("click", buttonClick);

document.querySelector("#Tokyo").addEventListener("click", buttonClick);

document.querySelector("#New-York").addEventListener("click", buttonClick);

document.querySelector("#current-location-button").addEventListener("click", clickMe);

search("New York");



