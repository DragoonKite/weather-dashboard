var searchHistory = [];
var lastSearched = "";

$("button").on("click", function(){
    //prevent refresh
    event.preventDefault();
    //get information entered by user
    var searchCriteria = document.querySelector("input");
    var sCText = searchCriteria.value.trim();
    lastSearched = sCText;
    //add to search history array
    searchHistory.push(sCText);
    
    //save array
    saveHistory(searchHistory,lastSearched);
    //clear form
    searchCriteria.value = "";

    pullData(sCText);
});

$("#history-display").on("click", "p", function(){
    var selection = $(this)[0].innerHTML;
    lastSearched = selection;
    saveHistory(searchHistory, lastSearched);
    pullData(selection);
});

var pullData = function(city){
    //API section on click
    
    var apiURLCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=1ec4b7941e836b90f16c4552ee588075";

    //Current day weather api used to get the lat/long of selected city
    fetch(apiURLCurrent).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                //lat/long taken and the used in the One Call API
                var lat = data.coord.lat;
                var long = data.coord.lon;
                //One Call API
                var apiURLOne = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&exclude=minutely,hourly&units=imperial&appid=1ec4b7941e836b90f16c4552ee588075"
                fetch(apiURLOne).then(function(response){
                    if(response.ok){
                        response.json().then(function(data){
                            //Begin current day forecast section
                            //City name and weather icon
                            $("#searched-city").html(city + "<img src='http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png' alt='" + data.current.weather[0].description + "'>");
                            //Temperature
                            $("#searched-temp").html("Temperature: " + data.current.temp +"\u00B0 F");
                            //Humidity
                            $("#searched-hum").html("Humidity: " + data.current.humidity);
                            //Wind Speed
                            $("#searched-wind").html("Wind Speed: " + data.current.wind_speed + " MPH");
                            //UV Index
                            var uvBg = "";
                            var uv = data.current.uvi;
                            //set background color according to severity of the UV Index
                            if (uv <= 2){
                                uvBg = "bg-success>"
                            }
                            else if (uv <=7 ){
                                uvBg = "bg-warning"
                            }
                            else{
                                uvBg = "bg-danger"
                            };

                            $("#searched-uv").html("UV Index: " + "<span class=" + uvBg + uv + "</span>")
                            //End of current day forecast section

                            //Begin 5-day forecast section
                            //clear old 5-day data from screen
                            $("#5-day-card-container").empty();
                            //create container element for 5 day forecast cards
                            var forecastContainer = document.getElementById("5-day-card-container");
                            //iterate through the data. Each object is +3 hourse so i increaes by 8 to move to the next day
                            for(var i=0; i < 5; i++){
                                var forecastDate = moment().add(i+1,'d').format("L");
                                var forecastTemp = data.daily[i].temp.day;
                                var forecastHumid = data.daily[i].humidity;
                                var forecastCoverIcon = data.daily[i].weather[0].icon;
                                var forecastCoverDesc = data.daily[i].weather[0].description;
                                
                                //create the individual forecast card element
                                var forecast = document.createElement("div");
                                //add the class to the card and the wanted data
                                forecast.classList.add("card", "bg-primary", "border-primary", "m-3");
                                forecast.innerHTML = "<h5>" + forecastDate + "</h5><img src='http://openweathermap.org/img/wn/" + forecastCoverIcon + "@2x.png' alt='" + forecastCoverDesc + "'></span><span>Temp: " + forecastTemp + " \u00B0 F</span><span>Humidity: " + forecastHumid + "%</span>";

                                //attach the forecast card to the container element and repeat
                                forecastContainer.appendChild(forecast);
                                //End of 5-Day forecast section
                            };
                        });
                    }
                    else{
                        //if api fecth fails, alert the user
                        alert("Error: " + response.statusText)
                    };
                });
            });
        }
        else{
            //if api fecth fails, alert the user
            alert("Error: " + response.statusText)
        };
    });   
};
    
var loadHistory = function(){
    //load search history if avaialble from localstorage
    searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
    lastSearched = JSON.parse(localStorage.getItem('lastSearched'));
    //set array to empty if nothing in local storage
    if(!searchHistory){
        searchHistory = []
    }
    else{
        displayHistory(searchHistory);
    };

    if(!lastSearched){
        lastSearched = ""
    }
    else{
        pullData(lastSearched);
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
var saveHistory = function(history,searched){
    //remove duplicates from search history
    uniqueHistory = [...new Set(history)];
    console.log(uniqueHistory);
    searchHistory = Array.from(uniqueHistory);
    while(searchHistory.length > 10){
        searchHistory.shift();
        console.log(searchHistory);
    };
    localStorage.setItem('searchHistory', JSON.stringify(history))
    localStorage.setItem('lastSearched', JSON.stringify(searched));
    displayHistory(searchHistory);
};

//load data on page opening
loadHistory();