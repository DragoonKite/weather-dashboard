

$("button").on("click", function(){
    event.preventDefault();
    var searchCriteria = document.querySelector("input");
    console.log(searchCriteria.value.trim());
    searchCriteria.value = "";
})



