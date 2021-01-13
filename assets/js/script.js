var searchHistory = [];

$("button").on("click", function(){
    event.preventDefault();
    var searchCriteria = document.querySelector("input").value.trim();
    searchHistory.push(searchCriteria);
    saveHistory(searchHistory);
    searchCriteria.value = "";
});

var loadHistory = function(){
    searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
    if(!searchHistory){
        searchHistory = []
    }
    else{
        displayHistory(searchHistory);
    };
};

var displayHistory = function(history){
    console.log(history);
};

var saveHistory = function(history){
    localStorage.setItem('searchHistory', JSON.stringify(history))
};

loadHistory();