// BEGINNING OF JS FILE
$(document).ready(function () {
    // INPUT FIELD IS BLANK SO USER CAN ENTER THE CITY THEY WANT A FORECAST FOR
    var inputCity = "";
    // APIKEY FOR OPENWEATHERMAP API
    var APIKey = "ff190912e73db2be11befe0e9575b205";

    initDoc();

    // FUNCTIONALITY FOR THE SEARCH BUTTON
    $("#searchBtn").on("click", function () {
        if (saveCityList()) {
            retrieveForecast(true);
        };
    });

    

    
    
    
    
    
    
    
    
    
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

    
    
    
    function currentForecast() {
        var currentForecastURL = "https://api.openweathermap.org/data/2.5/weather?q=" + inputCity + "&appid=" + APIKey;

        $.ajax({
            url: currentForecastURL,
            method: "GET"
        }).then(function (presentForecast) {

            //MAKE SURE THE currentForecast ID IS EMPTY TO INPUT DATA
            $("#currentForecast").empty();
            //CREATE A NEW CARD BODY
            var newDiv = $("<div>").addClass("card-body");
            var newH4 = $("<h4>", { class: "card-title", text: inputCity + " (Current) " });
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
            var newP1 = $("<p>", { class: "card-text", text: "Temperature: " + kelvinToF.toFixed(1) + " °F" });
            var newP2 = $("<p>", { class: "card-text", text: "Humidity: " + presentForecast.main.humidity + "%" });
            var newP3 = $("<p>", { class: "card-text", text: "Wind Speed: " + presentForecast.wind.speed + " MPH" });
            var newP4 = $("<p>", { class: "card-text", text: "UV Index: " });

            //BEGINNING OF LAT&LON TO RETRIEVE THE UV USING ANOTHER API URL FROM OPENWEATHER
            var latValue = todaysWeather.coord.lat;
            var lonValue = todaysWeather.coord.lon;
            var uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + latValue + "&lon=" + lonValue;

            //BEGINNING AJAX CALL AND FUNCTION TO RETRIEVE UV INFO
            $.ajax({
                url: uvURL,
                method: "GET"
            }).then(function (uvWeather) {

                var uvValue = uvWeather.value;


                //GOING TO ASSIGN UV COLORS BASED ON THE UV INDEX VALUE
                if (uvValue < 3) {
                    uvColor = "lowuv"
                }
                else if (uvValue < 6) {
                    uvColor = "mediumuv"
                }
                else if (uvValue < 8) {
                    uvColor = "highuv"
                }
                else if (uvValue < 11) {
                    uvColor = "veryhighuv"
                }
                else {
                    uvColor = "extremelyhighuv"
                };

                //ATTACHING THE UV COLORS TO THE DIV CREATED ON LINE 45
                var newSpan = $("<span>", { class: uvColor, text: uvValue });
                newP4.append(newSpan);
                newDiv.append(newH4, newP1, newP2, newP3, newP4);
                $("#currentForecast").append(newDiv);

            });
        });
    };


    //BEGINNING OF THE FIVE DAY FORECAST
    function fiveDayForecast() {

        var fiveDayForecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + inputCity + "&appid=" + APIKey;

        //AJAX CALL
        $.ajax({
            url: fiveDayForecastURL,
            method: "GET"
        }).then(function (fullForecast) {
            console.log(fullForecast);
            $("#currentForecast").empty();
            $("#futureForecast").empty();

            $("#fiveDayForecast").text("Five Day Forecast");
        });

        //THE INFORMATION OF THAT THE API GIVES IS BASED ON THE TIME THE API IS CALLED, SO I'LL BE SETTING IT TO 3PM MILITARY TIME SO THAT THE FORECAST IS BASED OFF
        //3PM//15:00 FOR EACH DAY ON EACH CARD FOR EVERY POPULATED CITY THE USER INPUTS
        var time3PM = 0;
        for (i = 0; i < 8; i++) {
            if (fullForecast.list[i].dt_txt.includes("15:00:00")) {
                time3PM = i;
                break;
            }
        }


        //USE THE 3PM VARIABLE AND CREATE 5 CARDS FOR THE 5 DAY FORECAST. THE API POPULATES DATA FOR EVERY 3 HRS OF A DAY
        for (i = time3PM; i < 40; i += 8) {
            var section = "#section" + i;
            var newSection = $("<section>", { class: "col-lg-2", id: section });
            var newCard = $("<div>").addClass("card bg-primary text-white");
            var newDiv = $("<div>").addClass("card-body");
            var newH5 = $("<h5>", { class: "card-title", text: moment(fullForecast.list[i].dt_txt).format('MM/DD/YYYY') });
            //GRAB THE WEATHER ICON AND USE IT IN THE CARD
            var icon = fullForecast.list[i].weather[0].icon;
            var iconURL = "https://openweathermap.org/img/wn/" + icon + ".png"
            var newI = $("<img>").attr("src", iconURL);
            //GRAB THE TEMP AND HUMIDITY AS WELL
            var tempFromKelvin = (fullForecast.list[i].main.temp - 273.15) * 1.80 + 32
            var newP1 = $("<p>", { class: "card-text", text: "Temp: " + tempFromKelvin.toFixed(1) + " °F" });
            var newP2 = $("<p>", { class: "card-text", text: "Humidity: " + fullForecast.list[i].main.humidity + "%" });
            newDiv.append(newH5, newI, newP1, newP2);
            $(newCard).append(newDiv);
            $(newSection).append(newCard);
            $("#fivedaysection").append(newSection);
        }

    }


    //INITIALIZED THE DOCUMENT, BRING ANY PREVIOUSLY SEARCHED CITES FROM LOCAL STORAGE, AND LOAD LAST SEARCHED CITY
    function initDoc() {
        retrievePreviouslySearchedList();
        inputCity = retrieveLastCitySearched();
        if (inputCity != null) {
            retrieveForecast(false);
        }
    };

    //SAVE EVERY CITY THAT IS SEARCHED TO LOCAL STORAGE
    function saveLastCitySearched(cityName){
        localStorage.setItem("lastCitySearched", cityName);
    };

    //GRAB EVERY CITY SEARCHED FROM LOCAL STORAGE
    function retrieveLastCitySearched(){
        return localStorage.getItem("lastCitySearched");
    };    

    
    
    //GET THE CITY THAT THE USER INPUT. ALSO, ALERT USER IF THERE IS NOTHING IN THE INPUT FIELD
    function getInputCity() {
        inputCity = $("#searchInput").val().trim();
        if (inputCity == "") {
            alert("Please enter a city to search for.")
            return false;
        }
        return true;

    }

    //AS A USER CONTINUES TO SEARCH CITIES, SAVE THEM INTO AN ARRAY LOCALLY SO THAT THEY'RE IN ORDER IN THE LIST
    function saveCityList() {        

        if (getInputCity()) {
            var cities = JSON.parse(window.localStorage.getItem('citiesPreviouslySearched'));
            if (cities === null) {
                cities = [];
            }
            //IF THE CITY THAT WAS MOST RECENTLY SEARCHED IS ALREADY IN THE LIST OF SAVED CITIES, NO NEED TO SAVE AGAIN
            if (cities.indexOf(inputCity) == -1) {
                cities.push(inputCity);
                localStorage.setItem("citiesPreviouslySearched", JSON.stringify(cities));
                retrievePreviouslySearchedList();
            };         
            //MOVES THE CITY THAT WAS DUPLICATED TO THE TOP OF THE ARRAY/LIST
            saveLastCitySearched(inputCity);
            return true;
        };        
        return false;

    }

    //EMPTY THE TABLE AND INSERT EVERY PREVIOUSLY SEARCHED CITY INTO THE TABLE
    function retrievePreviouslySearchedList(){
        $("tbody").empty();
        var cities = JSON.parse(window.localStorage.getItem('citiesPreviouslySearched'));
        if (cities != null) {
            for (i = 0; i < cities.length; i++) {
                var newTR = $("<tr>");
                var citySearched = $("<td>").text(cities[i]);
                newTR.append(citySearched)      
                $("tbody").append(newTR);                
            }
        } 
    }




});
 // END OF JS FILE