var userInputEl = $("#userInput");
var searchBtnEl = $("#searchBtn");
var cityEl = $("#city");
var tempEl = $("#temp");
var windEl = $("#wind");
var humidityEl = $("#humidity");
var iconEl = $("#icon");

function getCoordinates(event) {
	event.preventDefault();
	var city = userInputEl.val().trim();
	if(city) {
		var url = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=10610edbd2d1162b9c9ba8135c819547";

		fetch(url)//calls Fetch API and uses url as parameter, returns a promise
		.then(function(response) {//then method used to return a response object (1st promise)
			if(response.ok) {//checks if response is successful
				response.json().then(function(data) {//2nd promise to return a body property called data in JSON format
					//function to display results
					getCity(data);
				});
			} else {
					alert("Error: " + response.statusText);
				}
		})

		userInputEl.val("");//clears input field
	} else {
			alert("Please enter a city")//alerts user if no text entered
		} 
}

function getCity(coordinates) {
	var lat = coordinates[0].lat;
	var lon = coordinates[0].lon;
	var requestURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=10610edbd2d1162b9c9ba8135c819547&units=imperial"

	fetch(requestURL)//calls Fetch API and uses requestURL as parameter, returns a promise
	.then(function(response) {//then method used to return a response object (1st promise)
		console.log(response);//debug
		if(response.ok) {//checks if response is successful
			response.json().then(function(data) {//2nd promise to return a body property called data in JSON format
					//function to display results
					getWeather(data);
				});
		} else {
				alert("Error: " + response.statusText);
			}
	})
}

function getWeather(weather) {
  var day = [];

  for(var i=0; i<6; i++) {
    day.push(weather.list[i*8]);
  }

  var iconCode = day[0].weather[0].icon;
  var iconURL = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png"
  console.log(cityEl);
  cityEl.text(weather.city.name + " (" + moment(day[0].dt_txt).format("L") + ")");
  $("#icon").attr("src", iconURL).attr("width", 30).attr("height", 30);
  tempEl.text("Temp: " + day[0].main.temp + " °F");
  windEl.text("Wind: " + day[0].wind.speed + " MPH");
  humidityEl.text("Humidity: " + day[0].main.humidity + "%");
}


searchBtnEl.on('click', getCoordinates);