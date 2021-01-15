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
    //5 day forcast api
    var apiURL5 = "https://api.openweathermap.org/data/2.5/forecast?q=" + sCText + "&units=imperial&appid=1ec4b7941e836b90f16c4552ee588075";

    var apiURLCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + sCText + "&units=imperial&appid=1ec4b7941e836b90f16c4552ee588075";

    //5 day forcast display 
    fetch(apiURL5).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                console.log(data)
                //create container element for 5 day forecast cards
                var forecastContainer = document.getElementById("5-day-card-container");
                //iterate through the data. Each object is +3 hourse so i increaes by 8 to move to the next day
                for(var i=0; i < data.list.length; i+=8){
                    var forecastDate = moment(String(data.list[i].dt_txt)).format("L");
                    var forecastTemp = data.list[i].main.temp;
                    var forecastHumid = data.list[i].main.humidity;
                    var forecastCoverIcon = data.list[i].weather[0].icon;
                    var forecastCoverDesc = data.list[i].weather[0].description;
                    
                    //create the individual forecast card element
                    var forecast = document.createElement("div");
                    //add the class to the card and the wanted data
                    forecast.classList.add("card", "bg-primary", "border-primary", "m-3");
                    forecast.innerHTML = "<h5>" + forecastDate + "</h5><img src='http://openweathermap.org/img/wn/" + forecastCoverIcon + "@2x.png' alt='" + forecastCoverDesc + "'></span><span>Temperature: " + forecastTemp + " \u00B0 F</span><span>Humidity: " + forecastHumid + "%</span>";

                    //attach the forecast card to the container element and repeat
                    forecastContainer.appendChild(forecast);
                };
            });
        }
        else{
            //if api fecth fails, alert the user
            alert("Error: " + response.statusText)
        };
    });

    //Current day weather
    fetch(apiURLCurrent).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                console.log(data)
                $("#searched-city").html(data.name + "<img src='http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png' alt='" + data.weather[0].description + "'>");
                $("#searched-temp").html("Temperature: " + data.main.temp +"\u00B0 F");
                $("#searched-hum").html("Humidity: " + data.main.humidity);
                $("#searched-wind").html("Wind Speed: " + data.wind.speed + " MPH");

            });
        }
        else{
            //if api fecth fails, alert the user
            alert("Error: " + response.statusText)
        };
    });   
});

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