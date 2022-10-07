var userInputEl = $("#userInput");
var searchBtnEl = $("#searchBtn");
var cityEl = $("#city");
var tempEl = $("#temp");
var windEl = $("#wind");
var humidityEl = $("#humidity");
var iconEl = $("#icon");
var forecastEl = $("#forecast-cards");

var displayCards = false;

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
          console.log(data.list[0]);//debug
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

  cityEl.text(weather.city.name + " (" + moment(day[0].dt_txt).format("L") + ")");
  $("#icon").attr("src", iconURL).attr("width", 50).attr("height", 50);
  tempEl.text("Temp: " + day[0].main.temp + " °F");
  windEl.text("Wind: " + day[0].wind.speed + " MPH");
  humidityEl.text("Humidity: " + day[0].main.humidity + "%");
}

function renderResults() {
  //Create and append cards for each day if not already displayed
  if(displayCards===false) {
    for(var i=0; i<5; i++) {
      var cardEl = $("<div>");
      cardEl.addClass("card m-3");
      cardEl.attr("id", "day" + i).attr("style", "width: 12rem");
      forecastEl.append(cardEl);
      var cardBodyEl = $("<div>");
      cardBodyEl.addClass("card-body");
      cardEl.append(cardBodyEl);
      var cardHeaderEl = $("<h4>");
      cardHeaderEl.addClass("card-title");
      cardHeaderEl.attr("id", "title" + i);
      cardHeaderEl.text("Date");//debug
      cardBodyEl.append(cardHeaderEl);
      var iconEl = $("<img>");
      iconEl.attr("id", "icon" + i);
      cardBodyEl.append(iconEl);
      var tempEl = $("<p>");
      tempEl.attr("id", "temp" + i);
      tempEl.text("Temp: ");//debug
      cardBodyEl.append(tempEl);
      var windEl = $("<p>");
      windEl.attr("id", "wind" + i);
      windEl.text("Wind: ");//debug
      cardBodyEl.append(windEl);
      var humidEl = $("<p>");
      humidEl.attr("id", "humid" + i);
      humidEl.text("Humidity: ");//debug
      cardBodyEl.append(humidEl);
    }
  }
  displayCards=true;
}
  

searchBtnEl.on('click', getCoordinates);