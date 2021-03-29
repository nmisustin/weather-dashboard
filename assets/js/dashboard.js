var searchBar = document.getElementById("search");
var searchButton = document.getElementById("search-button");
var searchHistory = document.getElementById("search-history");
var searchList = document.getElementById("search-list");
var pastCities = [];
var mostRecent = ""
var farenheit = " &#8457;"
var todaysDate = moment().format("MMMM Do YYYY");
var currentCityLocation = {lat:"", lon:""}
var fiveDayForecast = [document.getElementById("five-day-1"), 
    document.getElementById("five-day-2"), 
    document.getElementById("five-day-3"), 
    document.getElementById("five-day-4"), 
    document.getElementById("five-day-5")];
// http://openweathermap.org/img/wn/10d.png
function getCurrentCityData(city){
    var apiurl = "https://api.openweathermap.org/data/2.5/weather?q="+ city +"&appid=9f51e82ea4028359e9b2d5a85c069491&units=imperial"
    fetch(apiurl).then(function(response){
        if(response.ok){
            response.json()
            .then(function(data){
                console.log(data);
                var currentWeatherEl = document.getElementById("forcast-today");
                currentWeatherEl.innerHTML = "";
                var header = document.createElement("h2")
                var weatherSymbol = "http://openweathermap.org/img/wn/"+ data.weather[0].icon+".png"
                header.innerHTML = city + " ("+todaysDate+")<img src='" + weatherSymbol + "'/>";
                currentWeatherEl.appendChild(header);
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
                            var fiveDayHeader = document.getElementById("five-day-header");
                            var header = document.createElement("h2");
                            header.innerHTML= "Five Day Forecast:";
                            fiveDayHeader.appendChild(header);
                            for (var i =0; i < fiveDayForecast.length; i++){
                                //fiveDayForecast[i].setAttribute("class", "five-day")
                                fiveDayForecast[i].innerHTML=""
                                fiveDayForecast[i].classList.add("blue")
                                var date = moment().add(1+i, "days");
                                date = date.format("M/D/YY");
                                dateEl=document.createElement("p")
                                dateEl.innerHTML = date;
                                fiveDayForecast[i].appendChild(dateEl);
                                var weatherSymbol = "http://openweathermap.org/img/wn/"+ data.daily[i].weather[0].icon +".png"
                                var weatherSymbolEl = document.createElement("img");
                                weatherSymbolEl.setAttribute("src", weatherSymbol);
                                fiveDayForecast[i].appendChild(weatherSymbolEl);
                                var temp = data.daily[i].temp.day;
                                var tempEl = document.createElement("p")
                                tempEl.innerHTML= "Temperature: " + temp + farenheit;
                                fiveDayForecast[i].appendChild(tempEl);
                                var humidity = data.daily[i].humidity;
                                var humidityEl = document.createElement("p");
                                humidityEl.innerHTML = "Humidity: "+humidity+"%";
                                fiveDayForecast[i].appendChild(humidityEl);
                            }
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
    pastCities.push(city);
    console.log(pastCities);
    mostRecent = city;
    localStorage.setItem("mostRecent", mostRecent);
    localStorage.setItem("pastCities", JSON.stringify(pastCities))
    searchBar.value= "";
    displaySearchHistory();
}
function displaySearchHistory(){
    searchList.innerHTML= "";
    for (var i=0; i<pastCities.length; i++){
        var historyButton= document.createElement("button");
        historyButton.setAttribute("value", pastCities[i]);
        historyButton.setAttribute("type", "button");
        historyButton.setAttribute("class", "list-group-item list-group-item-action");
        historyButton.innerHTML = pastCities[i];
        searchList.appendChild(historyButton);
    }
}
function searchHistoryClick(event){
    var city = event.target.getAttribute("value");
    getCurrentCityData(city);
    mostRecent = city;
    localStorage.setItem("mostRecent", mostRecent);
}
function loadHistory(){
    var loadCities = localStorage.getItem("pastCities");
    loadCities=JSON.parse(loadCities);
    console.log(loadCities);
    pastCities = loadCities;
    displaySearchHistory(pastCities);
    var mostRecent = localStorage.getItem("mostRecent");
    getCurrentCityData(mostRecent);    
}
loadHistory();
searchHistory.addEventListener("click", searchHistoryClick);
searchButton.addEventListener("click", getSearchCity);