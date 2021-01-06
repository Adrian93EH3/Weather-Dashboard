// BEGINNING OF JS FILE


$(document).ready(function() {
    // INPUT FIELD IS BLANK SO USER CAN ENTER THE CITY THEY WANT A FORECAST FOR
    var searchCity = "";
    // APIKEY FOR OPENWEATHERMAP API
    var APIKey = "ff190912e73db2be11befe0e9575b205";

    // FUNCTIONALITY FOR THE SEARCH BUTTON
    $("#searchBtn").on("click", function() {
        if (saveCityList()) {
            retrieveWeather(true);
        };
    });

    $(document).on("click","td", function(e){
        inputCity = e.target.innerHTML;
        saveLastCitySearched(inputCity);
        retrieveWeather(false);
    });


   


});





























// END OF JS FILE