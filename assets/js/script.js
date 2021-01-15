var searchHistory = [];

$("button").on("click", function(){
    //prevent refresh
    event.preventDefault();
    //get information entered by user
    var searchCriteria = document.querySelector("input");
    var sCText = searchCriteria.value.trim();
    //add to search history array
    searchHistory.push(sCText);
    //save array
    saveHistory(searchHistory);
    //clear form
    searchCriteria.value = "";

    //API section on click
    var apiURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + sCText + "&units=imperial&appid=1ec4b7941e836b90f16c4552ee588075";

    fetch(apiURL).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                var forecastContainer = document.getElementById("5-day-card-container");
                var forecastDate = moment(String(data.list[0].dt_txt)).format("L");
                var forecastTemp = data.list[0].main.temp;
                var forecastHumid = data.list[0].main.humidity;
                var forecastCover = data.list[0].weather[0].description;
                
                var forecast = document.createElement("div");
                forecast.classList.add("card", "bg-primary", "border-primary", "m-3");
                forecast.innerHTML = "<h5>" + forecastDate + "</h5><span>" + forecastCover + "</span><span>Temperature: " + forecastTemp + "</span><span>Humidity: " + forecastHumid + "</span>";

                forecastContainer.appendChild(forecast);
            });
        }
        else{
            alert("Error: " + response.statusText)
        };
    });
});

var displayWeather = function(data){
    
};

var loadHistory = function(){
    //load search history if avaialble from localstorage
    searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
    //set array to empty if nothing in local storage
    if(!searchHistory){
        searchHistory = []
    }
    else{
        displayHistory(searchHistory);
    };
};

var displayHistory = function(history){
    //container for displaying history on the page below the search box
    var historyContainer = document.querySelector("#history-display");
    //makes container empty to prevent from displaying same search info multiple times
    historyContainer.textContent="";
    for(var i=0; i < history.length; i++){
        //set up each item in search history as its own p element
        var historyEl = document.createElement("p");
        historyEl.innerHTML = history[i];
        historyEl.classList = " d-block p-2 border align-middle fs-5 text-capitalize bg-white mb-0";
        historyContainer.appendChild(historyEl);
    };
};

//save search history to localstorage then update displayed history 
var saveHistory = function(history){
    localStorage.setItem('searchHistory', JSON.stringify(history))
    displayHistory(history);
};

//load data on page opening
loadHistory();