// BEGINNING OF JS FILE


$(document).ready(function () {
    // INPUT FIELD IS BLANK SO USER CAN ENTER THE CITY THEY WANT A FORECAST FOR
    var searchCity = "";
    // APIKEY FOR OPENWEATHERMAP API
    var APIKey = "ff190912e73db2be11befe0e9575b205";
    
    // FUNCTIONALITY FOR THE SEARCH BUTTON
    $("#searchBtn").on("click", function () {
        if (saveCityList()) {
            retrieveForecast(true);
        };
    });
    
    //GET THE CITY THAT THE USER INPUT. ALSO, ALERT USER IF THERE IS NOTHING IN THE INPUT FIELD
    function getInputCity(){
        inputCity = $("#searchInput").val().trim();
        if (inputCity == "") {
            alert("Please enter a city to search for.")
            return false;
        }
        return true;
        
    }
    
    $(document).on("click", "td", function (e) {
        inputCity = e.target.innerHTML;
        saveLastCitySearched(inputCity);
        retrieveForecast(false);
    });

    //THIS FUNCTION IS USED TO RETRIEVE THE WEATHER.  THE 'NEEDCITY' ARGUMENT IS USED
    //TO DETERMINE IF THE CITY HAS BEEN INPUT BY THE USER
    function retrieveForecast(needCity) {
        if (needCity) {
            getInputCity()
        }
        //OR IF THE CITY IS BEING RETRIEVED FROM LOCAL STORAGE, OR FROM LIST OF PREVIOUSLY SEARCHED CITIES
        currentForecast();
        fiveDayForecast();
    };

    function currentForecast () {
        var currentForecastURL = "https://api.openweathermap.org/data/2.5/weather?q=" + inputCity +"&appid=" + APIKey;

        $.ajax({
            url: currentForecastURL,
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
            var newP3 = $("<p>",{class: "card-text", text: "Wind Speed: " + presentForecast.wind.speed + " MPH"});
            var newP4 = $("<p>",{class: "card-text", text: "UV Index: "});

            //BEGINNING OF LAT&LON TO RETRIEVE THE UV USING ANOTHER API URL FROM OPENWEATHER
            var latValue = todaysWeather.coord.lat;
            var lonValue = todaysWeather.coord.lon;
            var uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + latValue + "&lon=" + lonValue;

            //BEGINNING AJAX CALL AND FUNCTION TO RETRIEVE UV INFO
            $.ajax({
                url: uvURL,
                method: "GET"
            }).then(function(uvWeather) {
                
                var uvValue = uvWeather.value;


                //GOING TO ASSIGN UV COLORS BASED ON THE UV INDEX VALUE
                if (uvValue < 3){
                    uvColor = "lowuv"
                }
                else if (uvValue < 6){
                    uvColor = "mediumuv"                    
                }
                else if (uvValue < 8){
                    uvColor = "highuv"                    
                }
                else if (uvValue < 11){
                    uvColor = "veryhighuv"                    
                }
                else {
                    uvColor = "extremelyhighuv"                    
                };

                //ATTACHING THE UV COLORS TO THE DIV CREATED ON LINE 45
                var newSpan = $("<span>",{class: uvColor, text: uvValue});
                newP4.append(newSpan);
                newDiv.append(newH4, newP1, newP2, newP3, newP4);
                $("#currentForecast").append(newDiv);

            });
        });

        //BEGINNING OF THE FIVE DAY FORECAST
        function fiveDayForecast () {

            var fiveDayForecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + inputCity + "&appid=" + APIKey;
            
            //AJAX CALL
            $.ajax({
            url: fiveDayForecastURL,
            method: "GET"
          })
        }
    };































});





























// END OF JS FILE