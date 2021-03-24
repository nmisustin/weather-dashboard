var searchBar = document.getElementById("search");
var searchButton = document.getElementById("search-button");
var pastCities = [];
function getCityData(city){
    var apiurl = "https://api.openweathermap.org/data/2.5/weather?q="+ city +"&appid=9f51e82ea4028359e9b2d5a85c069491"
    fetch(apiurl).then(function(response){
        if(response.ok){
            response.json()
            .then(function(data){
                console.log(data);
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
    getCityData(city);
}
searchButton.addEventListener("click", getSearchCity);