var userInputEl = $("#userInput");
var searchBtnEl = $("#searchBtn");
var clearBtnEl = $("#clearBtn");
var currentEl = $("#current");
var cityEl = $("#city");
var tempEl = $("#temp");
var windEl = $("#wind");
var humidityEl = $("#humidity");
var iconEl = $("#icon");
var forecastEl = $("#forecast-cards");
var previousCitiesEl = $("#previous-cities");

//Global variables
var previousCurrent = [];
var previousForecast = [];
var displayCards = false;

//Function init performed when page is opened
function init() {
  pullLocalStorage();
  renderPreviousCities();
}init();
//Function to get the coordinates of the city searched by using the API provided 
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
					getWeather(data);
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
//Function to get the weather data by passing in city coordinates, uses the Current Weather Data and 5 Day / 3 Hour Forecast API 
function getWeather(coordinates) {
	var lat = coordinates[0].lat;
	var lon = coordinates[0].lon;
	var forecastRequestURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=10610edbd2d1162b9c9ba8135c819547&units=imperial"
  var currentRequestURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=10610edbd2d1162b9c9ba8135c819547&units=imperial"
	
  fetch(currentRequestURL)//calls Fetch API and uses requestURL as parameter, returns a promise
	.then(function(response) {//then method used to return a response object (1st promise)
		if(response.ok) {//checks if response is successful
			response.json().then(function(data) {//2nd promise to return a body property called data in JSON format
					//function to display results
          displayCurrent(data);
          //function to append search
          appendSearch(data);
          //save data to local storage
          previousCurrent.push(data);
          localStorage.setItem("previousCurrent", JSON.stringify(previousCurrent));
				});
		} else {
				alert("Error: " + response.statusText);
			}
	})

  fetch(forecastRequestURL)//calls Fetch API and uses requestURL as parameter, returns a promise
	.then(function(response) {//then method used to return a response object (1st promise)
		if(response.ok) {//checks if response is successful
			response.json().then(function(data) {//2nd promise to return a body property called data in JSON format
					//function to display results
          renderResults();
					printForecast(data);
          //save data to local storage
          previousForecast.push(data);
          localStorage.setItem("previousForecast", JSON.stringify(previousForecast));
				});
		} else {
				alert("Error: " + response.statusText);
			}
	})
}
//Function to display the current weather forcast
function displayCurrent(day) {
  //Pulls weather icon code and concats to provided URL to create image url
  var iconCode = day.weather[0].icon;
  var iconURL = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
  
  //Print current day results
  cityEl.text(day.name + " (" + moment.utc().format("L") + ")");
  $("#icon").attr("src", iconURL).attr("width", 50).attr("height", 50);
  tempEl.text("Temp: " + day.main.temp + " °F");
  windEl.text("Wind: " + day.wind.speed + " MPH");
  humidityEl.text("Humidity: " + day.main.humidity + "%");
}
//Function to append city name 
function appendSearch(day) {
  var liEl = $("<div>");
  liEl.addClass("list-group-item list-group-item-action");
  liEl.attr("id", "city" + previousCurrent.length);
  liEl.text(day.name);
  previousCitiesEl.append(liEl);
}
//Function to render the 5 day forecast cards
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
      cardBodyEl.append(cardHeaderEl);
      var iconEl = $("<img>");
      iconEl.attr("id", "icon" + i);
      cardBodyEl.append(iconEl);
      var tempEl = $("<p>");
      tempEl.attr("id", "temp" + i);
      cardBodyEl.append(tempEl);
      var windEl = $("<p>");
      windEl.attr("id", "wind" + i);
      cardBodyEl.append(windEl);
      var humidEl = $("<p>");
      humidEl.attr("id", "humid" + i);
      cardBodyEl.append(humidEl);
    }
  }
  displayCards=true;
}
//Function to print the 5 day forecast for each card
function printForecast(day) {
  //Print 5 day forecast
  for(var i=0; i<5; i++) {
    var title = $("#title" + i);
    title.text(moment(day.list[(i*8)+7].dt_txt).format("L"));
    var icon = $("#icon" + i);
    var cardIconCode = day.list[(i*8)+7].weather[0].icon;
    var cardIconURL = "http://openweathermap.org/img/wn/" + cardIconCode + "@2x.png";
    icon.attr("src", cardIconURL).attr("width", 50).attr("height", 50);
    var temp = $("#temp" + i);
    temp.text("Temp: " + day.list[(i*8)+7].main.temp + " °F")
    var wind = $("#wind" + i);
    wind.text("Wind: " + day.list[(i*8)+7].wind.speed + " MPH")
    var humid = $("#humid" + i);
    humid.text("Humidity: " + day.list[(i*8)+7].main.humidity + "%")
  }
}
//Function to pull data from local storage
function pullLocalStorage() {
  var current = JSON.parse(localStorage.getItem("previousCurrent"));//pulls previousCities from local storage
  var forecast = JSON.parse(localStorage.getItem("previousForecast"));
  //if array has values, set it equal to global array
  if(current!=null) {
    for(var i=0; i<current.length; i++) {
      previousCurrent[i] = current[i];
    }
  }
  
  if(forecast!=null) {
    for(var i=0; i<forecast.length; i++) {
      previousForecast[i] = forecast[i];
    }
  }
}
//Function to render previous cities from local storage
function renderPreviousCities() {
  //append elements to previous cities id
  for(var i=0; i<previousCurrent.length; i++) {
    var liEl = $("<div>");
    liEl.addClass("list-group-item list-group-item-action");
    liEl.attr("id", "city" + i)
    liEl.text(previousCurrent[i].name);
    previousCitiesEl.append(liEl);
  }
}
//Function to search a city from the previous search list
function previousSearch(event) {
  for(var i=0; i<previousCurrent.length; i++) {
    if($(event.target).attr("id")=="city"+i) {
      displayCurrent(previousCurrent[i]);
      renderResults();
      printForecast(previousForecast[i]);
    }
  }
}

//Event listener for search button
searchBtnEl.on("click", getCoordinates);
//Event listener for previous city searches
previousCitiesEl.on("click", previousSearch);