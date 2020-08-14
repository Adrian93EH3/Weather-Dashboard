$(document).ready(function () {

    var inputCity = "";
    var APIKey = "3454e50c3bf841b68c9335f9ed3061d2";

    initDoc();

    //***** CLICKING EVENTS *****/
    // If the search button is clicked, then search.
    $("#searchBtn").on("click", function () {
        if (saveCityList()) {
            grabWeather(true);
        };

    });
    // If the enter key is pressed, then fire the search btn click event.
    $(document).keyup(function (e) {
        if (e.keyCode == 13) {
            $("#searchBtn").click();
        }
    });

    // If a previously grabbed city is clicked in the table, then set the input city variable, save the last city searched, and grab the weather.
    // This could should work on any td's already existing or added as the app is used.
    $(document).on("click", "td", function (e) {
        inputCity = e.target.innerHTML;
        saveLastCitySearched(inputCity);
        grabWeather(false);
    });
    // END CLICKING EVENTS 


    // This function is used to grab the weather.
    function grabWeather(needCity) {
        if (needCity) {
            getInputCity()
        }
       // Since AJAX is asynchronous, it doesn't matter which function is called first.
        buildTodaysWeather();
        buildfiveDayForecast();
    };

    //The function is expecting two things - the response object and the UV index data grabbed from the five day forecast API call.
    function buildTodaysWeather() {
        var currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + inputCity + "&appid=" + APIKey;

        $.ajax({
            url: currentWeatherURL,
            method: "GET"
        }).then(function (todaysWeather) {

            $("#todaysForecast").empty();
            var newDiv = $("<div>").addClass("card-body");
            var newH4 = $("<h4>", { class: "card-title", text: inputCity + " (Current) " });
            var icon = todaysWeather.weather[0].icon;
            var iconURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png"
            var newI = $("<img>").attr("src", iconURL);
            newH4.append(newI);
            var tempFromKelvin = (todaysWeather.main.temp - 273.15) * 1.80 + 32
            var newP1 = $("<p>", { class: "card-text", text: "Temperature: " + tempFromKelvin.toFixed(1) + " °F" }); //  alt 0 1 7 6
            var newP2 = $("<p>", { class: "card-text", text: "Humidity: " + todaysWeather.main.humidity + "%" });
            var newP3 = $("<p>", { class: "card-text", text: "Wind Speed: " + todaysWeather.wind.speed + " MPH" });
            var newP4 = $("<p>", { class: "card-text", text: "UV Index: " });
            var latValue = todaysWeather.coord.lat;
            var lonValue = todaysWeather.coord.lon;
            var uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + latValue + "&lon=" + lonValue;

            $.ajax({
                url: uvURL,
                method: "GET"
            }).then(function (uvWeather) {

                var uvValue = uvWeather.value;
                var uvColor = "";
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

                var newSpan = $("<span>", { class: uvColor, text: uvValue });
                newP4.append(newSpan);
                newDiv.append(newH4, newP1, newP2, newP3, newP4);
                $("#todaysForecast").append(newDiv);
            });
        });
    }

    function buildfiveDayForecast() {
        var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + inputCity + "&appid=" + APIKey;

        $.ajax({
            url: fiveDayURL,
            method: "GET"
        }).then(function (fiveDaysWeather) {
            console.log(fiveDaysWeather);
            $("#fiveDayForecast").empty();
            $("#fiveDayForecastSection").empty();

            $("#fiveDayForecast").text("5-Day Forecast");

            var element3PMFirstAppears = 0;
            for (i = 0; i < 8; i++) {
                if (fiveDaysWeather.list[i].dt_txt.includes("15:00:00")) {
                    element3PMFirstAppears = i;
                    break;
                }
            }

            for (i = element3PMFirstAppears; i < 40; i += 8) {
                var sectionNbr = "#section" + i;
                var newSection = $("<section>", { class: "col-lg-2", id: sectionNbr });
                var newCard = $("<div>").addClass("card bg-primary text-white");
                var newDiv = $("<div>").addClass("card-body");
                var newH5 = $("<h5>", { class: "card-title", text: moment(fiveDaysWeather.list[i].dt_txt).format('MM/DD/YYYY') });
                // Get the weather icon and include it in the card
                var icon = fiveDaysWeather.list[i].weather[0].icon;
                var iconURL = "https://openweathermap.org/img/wn/" + icon + ".png"
                var newI = $("<img>").attr("src", iconURL);
                // Get temperature and humidity too
                var tempFromKelvin = (fiveDaysWeather.list[i].main.temp - 273.15) * 1.80 + 32
                var newP1 = $("<p>", { class: "card-text", text: "Temp: " + tempFromKelvin.toFixed(1) + " °F" }); //  alt 0 1 7 6
                var newP2 = $("<p>", { class: "card-text", text: "Humidity: " + fiveDaysWeather.list[i].main.humidity + "%" });
                newDiv.append(newH5, newI, newP1, newP2);
                $(newCard).append(newDiv);
                $(newSection).append(newCard);
                $("#fiveDayForecastSection").append(newSection);
            }
        });
    }

    // ALL CODE FROM HERE DOWN RELATES TO SAVING CITY LIST, LAST CITY SEARCHED, ETC.
    function initDoc() {
        grabPreviouslySearchedList();
        inputCity = grabLastCitySearched();
        if (inputCity != null) {
            grabWeather(false);
        }
    };

    function getInputCity() {
        inputCity = $("#searchInput").val().trim();
        if (inputCity == "") {
            alert("Please enter a city to search for.")
            return false;
        }
        return true;

    }

    // Save the last city searched
    function saveLastCitySearched(cityName) {
        localStorage.setItem("lastCitySearched", cityName);
    };

    // Grab the last city searched
    function grabLastCitySearched() {
        return localStorage.getItem("lastCitySearched");
    };

    // Save the list of cities that the user searches
    function saveCityList() {
        if (getInputCity()) {
            var cities = JSON.parse(window.localStorage.getItem('citiesPreviouslySearched'));
            if (cities === null) {
                cities = [];
            }
            // Check to see if the city that was just searched already appears in the list of saved cities. If it does, no reason to save it again.
            if (cities.indexOf(inputCity) == -1) {
                cities.push(inputCity);
                localStorage.setItem("citiesPreviouslySearched", JSON.stringify(cities));
                grabPreviouslySearchedList();
            }; saveLastCitySearched(inputCity);
            return true;
        };
        return false;

    }

    // First, empty the body of the table.  Get all of the cities previously searched, and add them to the table.
    function grabPreviouslySearchedList() {
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