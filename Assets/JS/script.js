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
             var icon = presentForecast.weather[0].icon;
             //USES THE API's ICONS FOR WEATHER TO SHOW SUNNY, RAIN, CLOUDY, ETC
             var iconURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png"
             //USES THE VARIABLE ABOVE AND ATTACHES IT TO A NEWLY CREATED IMG TAG AND USES THE SRC ATTR TO READ IT
             var newI = $("<img>").attr("src", iconURL);
             //ATTACHES THE NEW IMG ICON TO THE H4
             newH4.append(newI);

            //EVERYTHING BELOW WILL BE ABOUT THE TEMP, HUMIDITY, WIND SPEED AND UV INDEX
            
            //API USES KELVIN, HAD TO CONVERT TO FAHRENHEIT
            var kelvinToF = (presentForecast.main.temp - 273.15) * 1.80 + 32
            var newP1 = $("<p>",{class: "card-text", text: "Temperature: " + kelvinToF.toFixed(1) + " °F"});
            var newP2 = $("<p>",{class: "card-text", text: "Humidity: " + presentForecast.main.humidity +"%"});
            
            
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