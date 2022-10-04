var userInputEl = $("#userInput");
var searchBtnEl = $("#searchBtn");

function getCoordinates(event) {
    event.preventDefault();
    var city = userInputEl.val().trim();
    console.log(city);//debug
    if(city) {
        var url = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=10610edbd2d1162b9c9ba8135c819547";

        console.log(fetch(url));//debug
        fetch(url)//calls Fetch API and uses url as parameter, returns a promise
            .then(function(response) {//then method used to return a response object (1st promise)
                console.log(response);//debug
                if(response.ok) {//checks if response is successful
                    response.json().then(function(data) {//2nd promise to return a body property called data in JSON format
                        //function to display results
                        console.log(data);//debug
                        console.log(data[0].lat);//debug
                        console.log(data[0].lon);//debug
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
    var requestURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=10610edbd2d1162b9c9ba8135c819547"
    console.log(requestURL);//debug

    fetch(requestURL)//calls Fetch API and uses requestURL as parameter, returns a promise
            .then(function(response) {//then method used to return a response object (1st promise)
                console.log(response);//debug
                if(response.ok) {//checks if response is successful
                    response.json().then(function(data) {//2nd promise to return a body property called data in JSON format
                        //function to display results
                        console.log(data);//debug
                        console.log(data.list[0]);//debug
                        console.log(data.list[8]);//debug
                    });
                } else {
                    alert("Error: " + response.statusText);
                }
            })
}

searchBtnEl.on('click', getCoordinates);