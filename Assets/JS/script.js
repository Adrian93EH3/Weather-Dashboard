// BEGINNING OF JS FILE


$(document).ready(function () {
    // INPUT FIELD IS BLANK SO USER CAN ENTER THE CITY THEY WANT A FORECAST FOR
    var searchCity = "";
    // APIKEY FOR OPENWEATHERMAP API
    var APIKey = "ff190912e73db2be11befe0e9575b205";

    // FUNCTIONALITY FOR THE SEARCH BUTTON
    $("#searchBtn").on("click", function () {
        if (saveCityList()) {
            retrieveWeather(true);
        };
    });

    $(document).on("click", "td", function (e) {
        inputCity = e.target.innerHTML;
        saveLastCitySearched(inputCity);
        retrieveWeather(false);
    });

    //THIS FUNCTION IS USED TO RETRIEVE THE WEATHER.  THE 'NEEDCITY' ARGUMENT IS USED
    //TO DETERMINE IF THE CITY HAS BEEN INPUT BY THE USER
    function retrieveWeather(needCity) {
        if (needCity) {
            getInputCity()
        }
        //OR IF THE CITY IS BEING RETRIEVED FROM LOCAL STORAGE, OR FROM LIST OF PREVIOUSLY SEARCHED CITIES
        currentForecast();
        fiveDayForecast();
    };

    function currentForecast () {
        var currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + inputCity +"&appid=" + APIKey;

        $.ajax({
            url: currentWeatherURL,
            method: "GET"
          }).then(function(presentForecast) {

            //MAKE SURE THE currentForecast ID IS EMPTY TO INPUT DATA
            $("#currentForecast").empty();
            //CREATE A NEW CARD BODY
             var newDiv = $("<div>").addClass("card-body");
             var newH4 = $("<h4>",{class: "card-title", text: inputCity + " (Current) "});
             var icon =todaysWeather.weather[0].icon;
        });
    
    
    };






























    //GET THE CITY THAT THE USER INPUT. ALSO, ALERT USER IF THERE IS NOTHING IN THE INPUT FIELD
    function getInputCity(){
        inputCity = $("#searchInput").val().trim();
        if (inputCity == "") {
            alert("Please enter a city to search for.")
            return false;
        }
        return true;
        
    }

});





























// END OF JS FILE