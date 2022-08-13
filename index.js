function formatDate(response) {
    let long = response.data.coord.lon;
    let lat = response.data.coord.lat;
    let timestamp = response.data.dt;
    let apiKey = "AIzaSyAmEhwxiu-sfYbG1VkFzx-T3wXsGIDqK-8";
    let url = `https://maps.googleapis.com/maps/api/timezone/json?location=${lat}%2C${long}&timestamp=${timestamp}&key=AIzaSyAmEhwxiu-sfYbG1VkFzx-T3wXsGIDqK-8`;
    axios.get(url).then(getDate);
}

function getDate(response) {
    let timezone = response.data.timeZoneId;
    let url = `https://worldtimeapi.org/api/timezone/${timezone}`;
    axios.get(url).then(displayDate);
}

function displayDate(response) {
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    let day = days[response.data.day_of_week];
    let hours = fixHours(parseInt(response.data.datetime.slice(11, 13)));
    let minutes = response.data.datetime.slice(14, 16);
    let unit = getTimeUnit(parseInt(response.data.datetime.slice(11, 13)));
    let time = `${hours}:${minutes} ${unit}`;

    document.querySelector("#current-date-time").innerHTML = day + "<br>" + time;
}

function fixHours(hours) {
  if (hours > 12) {
    hours -= 12;
  }
  return hours;
}

function fixMinutes(minutes) {
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  return minutes;
}

function getTimeUnit(hours) {
  if (hours >= 12) {
    return "PM";
  } else {
    return "AM";
  }
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
    document.querySelector("h1").innerHTML = response.data.name;
    document.querySelector("#current-temp").innerHTML = Math.round(response.data.main.temp);
    document.querySelector("#weather").innerHTML = response.data.weather[0].description;
    document.querySelector("#humidity").innerHTML = response.data.main.humidity;
    document.querySelector("#wind").innerHTML = response.data.wind.speed;
}

function displaySearch(response) {
    console.log(response);
    document.querySelector("h1").innerHTML = response.data.name;
    document.querySelector("#current-temp").innerHTML = Math.round(response.data.main.temp);
    document.querySelector("#weather").innerHTML = response.data.weather[0].description;
    document.querySelector("#humidity").innerHTML = response.data.main.humidity;
    document.querySelector("#wind").innerHTML = response.data.wind.speed;
    formatDate(response);
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

document.querySelector("#search-engine").addEventListener("submit", handleSubmit);

document.querySelector("#Paris").addEventListener("click", buttonClick);

document.querySelector("#Sydney").addEventListener("click", buttonClick);

document.querySelector("#Tokyo").addEventListener("click", buttonClick);

document.querySelector("#New-York").addEventListener("click", buttonClick);

document.querySelector("#current-location-button").addEventListener("click", clickMe);

search("New York");


