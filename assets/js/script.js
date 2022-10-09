var searchFormEl = $("#search-form");
var clearBtnEl = $("#clearBtn");
var currentEl = $("#current");
var cityEl = $("#city");
var tempEl = $("#temp");
var windEl = $("#wind");
var humidityEl = $("#humidity");
var iconEl = $("#icon");
var forecastEl = $("#forecast-cards");
var previousCitiesEl = $("#previous-cities");

var count = 0;
var search = [];

function init() {
  search = JSON.parse(localStorage.getItem("previousSearch"));//pulls previous searches from local storage
  count = JSON.parse(localStorage.getItem("previousCount"));
  if(count==null) {
    count = 0;
  }
  if(search!=null) {
    for(var i=0; i<search.length; i++) {
      var liEl = $("<div>");
      liEl.addClass("list-group-item list-group-item-action");
      liEl.attr("id", "city" + i)
      liEl.text(search[i]);
      previousCitiesEl.append(liEl);
    }
  }
  
}init();

function searchAPICoordinates(city) {
  var url = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=10610edbd2d1162b9c9ba8135c819547";
  
		fetch(url)//calls Fetch API and uses url as parameter, returns a promise
		.then(function(response) {//then method used to return a response object (1st promise)
			if(response.ok) {//checks if response is successful
				response.json().then(function(data) {//2nd promise to return a body property called data in JSON format
					if(data.length===0){
            alert("No results found.");
          } else {
            var lat = data[0].lat;
	          var lon = data[0].lon;
            searchAPIWeather(lat, lon);
          }
				});
			} else {
					alert("Error: " + response.statusText);
				}
		})
    //clear input
    var userInputEl = $("#user-input");
		userInputEl.val("");
}

function searchAPIWeather(lat, lon) {
  var forecastRequestURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=10610edbd2d1162b9c9ba8135c819547&units=imperial"
  var currentRequestURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=10610edbd2d1162b9c9ba8135c819547&units=imperial"
	
  fetch(currentRequestURL)//calls Fetch API and uses requestURL as parameter, returns a promise
	.then(function(response) {//then method used to return a response object (1st promise)
		if(response.ok) {//checks if response is successful
			response.json().then(function(data) {//2nd promise to return a body property called data in JSON format
        if(data.length===0){
          alert("No results found.");
        } else if(search!=null) {
          if(search.includes(data.name)) {
            printCurrentWeather(data);
          } else {
            printCurrentWeather(data);
            searchList(data);
          }
        } else {
          //function to display results
          printCurrentWeather(data);
          searchList(data);
        }
        
        
				});
		} else {
				alert("Error: " + response.statusText);
			}
	})

  fetch(forecastRequestURL)//calls Fetch API and uses requestURL as parameter, returns a promise
	.then(function(response) {//then method used to return a response object (1st promise)
		if(response.ok) {//checks if response is successful
			response.json().then(function(data) {//2nd promise to return a body property called data in JSON format
        if(data.length===0){
          alert("No results found.");
        } else {
          //function to display results
          forecastEl.text("");//clears previous cards
          for(var i=0; i<40; i++) {
            if(data.list[i].dt_txt.indexOf("12:00:00") > -1) { //checks to output weather at noon for each day
            printForecast(data.list[i], i);
           }
          }
        }
				});
		} else {
				alert("Error: " + response.statusText);
			}
	})
}

function printCurrentWeather(day) {
  //Pulls weather icon code and concats to provided URL to create image url
  var iconCode = day.weather[0].icon;
  var iconURL = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
  
  //Print current day results
  cityEl.text(day.name + " (" + moment().format("L") + ")");
  $("#icon").attr("src", iconURL).attr("width", 50).attr("height", 50);
  tempEl.text("Temp: " + day.main.temp + " °F");
  windEl.text("Wind: " + day.wind.speed + " MPH");
  humidityEl.text("Humidity: " + day.main.humidity + "%");
}

function printForecast(day, i) {
  var cardEl = $("<div>");
  cardEl.addClass("card m-3");
  cardEl.attr("id", "day" + i).attr("style", "width:12rem;background-color:#1d3253;color:#ffffff");
  forecastEl.append(cardEl);
  var cardBodyEl = $("<div>");
  cardBodyEl.addClass("card-body");
  cardEl.append(cardBodyEl);
  var cardHeaderEl = $("<h4>");
  cardHeaderEl.addClass("card-title");
  cardHeaderEl.attr("id", "title" + i);
  cardHeaderEl.text(moment(day.dt_txt).format("L"));
  cardBodyEl.append(cardHeaderEl);
  var iconEl = $("<img>");
  iconEl.attr("id", "icon" + i);
  var cardIconCode = day.weather[0].icon;
  var cardIconURL = "http://openweathermap.org/img/wn/" + cardIconCode + "@2x.png";
  iconEl.attr("src", cardIconURL).attr("width", 50).attr("height", 50);
  cardBodyEl.append(iconEl);
  var tempEl = $("<p>");
  tempEl.attr("id", "temp" + i);
  tempEl.text("Temp: " + day.main.temp + " °F");
  cardBodyEl.append(tempEl);
  var windEl = $("<p>");
  windEl.text("Wind: " + day.wind.speed + " MPH");
  cardBodyEl.append(windEl);
  var humidEl = $("<p>");
  humidEl.attr("id", "humid" + i);
  humidEl.text("Humidity: " + day.main.humidity + "%")
  cardBodyEl.append(humidEl);
}

function searchList(day) {
  if(search==null) {
    search = [];
  }
  search.push(day.name);
  localStorage.setItem("previousSearch", JSON.stringify(search));
  var liEl = $("<div>");
  liEl.addClass("list-group-item list-group-item-action");
  liEl.attr("id", "city" + count);
  count++;
  localStorage.setItem("previousCount", JSON.stringify(count));
  liEl.text(day.name);
  previousCitiesEl.append(liEl);
}

function handleSearch(event) {
  event.preventDefault();

  var userInputEl = $("#user-input").val();
  
  //check if user entered any text
  if(!userInputEl) {
    alert("Please enter a city")
    return;
  }
  
  searchAPICoordinates(userInputEl);
}

function previousSearch(event) {
  event.preventDefault();
  search = JSON.parse(localStorage.getItem("previousSearch"));

  for(var i=0; i<search.length; i++) {
    if($(event.target).attr("id")=="city"+i) {
      searchAPICoordinates($("#city"+i).text());
    }
  }
}

//Event listener for search button
searchFormEl.on("submit", handleSearch);
//Event listener for previous city searches
previousCitiesEl.on("click", previousSearch);