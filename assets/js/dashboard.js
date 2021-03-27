var searchBar = document.getElementById("search");
var searchButton = document.getElementById("search-button");
var pastCities = [];
var farenheit = " &#8457;"
var todaysDate = moment().format("MMMM Do YYYY");
var currentCityLocation = {lat:"", lon:""}
var currentData = {temperature: "", humidity:"", windSpeed: "", uvIndex: ""}
// http://openweathermap.org/img/wn/10d.png
function getCurrentCityData(city){
    var apiurl = "https://api.openweathermap.org/data/2.5/weather?q="+ city +"&appid=9f51e82ea4028359e9b2d5a85c069491&units=imperial"
    fetch(apiurl).then(function(response){
        if(response.ok){
            response.json()
            .then(function(data){
                console.log(data);
                var currentWeatherEl = document.getElementById("forcast-today");
                var header = document.createElement("h2")
                var weatherSymbol = "http://openweathermap.org/img/wn/"+ data.weather[0].icon+".png"
                var weatherSymbolEl = document.createElement("img");
                weatherSymbolEl.setAttribute("src", weatherSymbol);
                console.log (weatherSymbolEl)
                header.textContent = city + " ("+todaysDate+")";
                currentWeatherEl.appendChild(header);
                currentWeatherEl.appendChild(weatherSymbolEl);
                var temperature= data.main.temp;
                var temperatureEl = document.createElement("p")
                temperatureEl.innerHTML ="Temperature: " +temperature+farenheit;
                currentWeatherEl.appendChild(temperatureEl) 
                var humidity= data.main.humidity;
                var humidityEl = document.createElement("p")
                humidityEl.innerHTML = "Humidity: " + humidity +"%";
                currentWeatherEl.appendChild(humidityEl);
                var windSpeed =data.wind.speed;
                var windSpeedEl = document.createElement("p")
                windSpeedEl.innerHTML = "Wind Speed: " + windSpeed + " mph";
                currentWeatherEl.appendChild(windSpeedEl);
                currentCityLocation.lat = data.coord.lat;
                currentCityLocation.lon = data.coord.lon;
                console.log(currentCityLocation);
                fetch("https://api.openweathermap.org/data/2.5/onecall?lat="+currentCityLocation.lat+"&lon="+currentCityLocation.lon+"&exclude=hourly,minutely&appid=9f51e82ea4028359e9b2d5a85c069491&units=imperial")
                .then(function(response){
                    if (response.ok){
                        response.json()
                        .then(function(data){
                            console.log(data);
                            var uvIndex=data.current.uvi;
                            var uvColor = "";
                            if (uvIndex<=2){
                                uvColor = "low"
                            }
                            else if (uvIndex>2  && uvIndex <= 5){
                                uvColor= "moderate"
                            }
                            else if (uvIndex > 5 && uvIndex<= 7){
                                uvColor = "high"
                            }
                            else{
                                uvColor = "very-high"
                            }
                            var uvIndexEl = document.createElement("p")
                            uvIndexEl.innerHTML="UV Index: <span class = '" + uvColor +"'>"+uvIndex+"</span>"
                            currentWeatherEl.appendChild(uvIndexEl)
                        })
                    }
                    else{
                        console.log("Error: " + response.statusText);
                    }
                })
                .catch(function(error){
                    console.log("unable to connect")
                })
            })
        }
        else{
            console.log("Error: " + response.statusText);
        }
    })
    .catch(function(error){
        console.log("unable to connect")
    })
}
function getSearchCity(){
    var city = searchBar.value.trim();
    getCurrentCityData(city);
}
searchButton.addEventListener("click", getSearchCity);