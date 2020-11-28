var wikiLink = "https://en.wikipedia.org/wiki/";
var city  = "";
var state = "";
var startDate = "";
var endDate = "";
var element = "";
var table = "";
var instances = "";
var arr = [];

// Creates today and tomorrow for use in Travelocity
// If startDate and endDate are too far apart, Travelocity uses random dates
var today = new Date();
const offset = today.getTimezoneOffset();
today = new Date(today.getTime() - (offset * 60 * 1000));
today = today.toISOString().split("T")[0];

var tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow = new Date(tomorrow.getTime() - (offset * 60 * 1000));
tomorrow = tomorrow.toISOString().split('T')[0]

window.onload = function () {

    // Initializes Materialize components
    var elems = document.querySelectorAll('.collapsible');
    instances = M.Collapsible.init(elems);
    $('.parallax').parallax();
    $('select').formSelect();

    // Hides results
    $("#contentHeader").hide();
    $("#mainContent").hide();

    // Shows destination buttons and collapsible
    $("#searchButton").click(search);

    // Displays search data for sports, music, or theater
    $(".element").click(fetch);

    // Hides results when city or state are changed
    $("#searchCity").on('input', hideResults);
    $("#searchState").on('change', hideResults);

    // Hide collapsible element when start or end date are changed
    $("#firstDate").on('input', closeElement);
    $("#secondDate").on('input', closeElement);

    // Hide collapsible element when model is closed
    $("#modalButton").click(closeElement);
}

function search() {

    // If not first search, close element
    closeElement();

    // Retrieve inupt data
    startDate = $("#firstDate").val();
    endDate = $("#secondDate").val();
    city = $("#searchCity").val().trim();
    state = $("#searchState").val();

    // Check input data
    if (startDate === "" || endDate === "" || city === "" || state === null) {
        $("#errorMessage").text("Please fill out all fields before submitting");
        $('.modal').modal({ dismissible: true });
        $("#errorModal").modal("open");
    }
    else if (startDate > endDate) {
        $("#errorMessage").text("Date of Departure must be after Date of Arrival");
        $('.modal').modal({ dismissible: true });
        $("#errorModal").modal("open");
    }
    else {
        $("#contentHeader").show();
        $("#mainContent").show();
        $("#buttonDiv").text("");

        // Make first letter of each word in city name uppercase and display city
        city = city.toLowerCase();
        city = city.replace("-", " - ");
        arr = [];
        city = capitalize(city);
        city = city.replace(" - ", "-");
        $("#cityName").text(city + ", " + state);

        // Prepare state and city for URLs
        var lowerState = state.toLowerCase();
        hyphenCity = city;
        delimiterCity = city;
        // If there are spaces in city, calls delimitCity to replace them with "-" or "%20"
        var patt = /\s/;
        if (patt.test(city) == true) {
            hyphenCity = delimitCity("-").toLowerCase();
            delimiterCity = delimitCity("%20");
        }

        // Create URLs
        var wikiURL = wikiLink + city + ", " + state;

        var searchTerm = city + "+" + state;
        var travelURL = "https://www.travelocity.com/Hotel-Search?destination=" + searchTerm + "&endDate=" + tomorrow + "&startDate=" + today;

        var mapURL = "https://www.mapquest.com/search/results?slug=%2Fus%2F" + lowerState + "%2F" + hyphenCity + "&query=" + delimiterCity + ",%20" + state + "&page=0";

        var weatherURL = "https://www.wunderground.com/weather/us/" + lowerState + "/" + hyphenCity;

        // Create buttons
        var wikiButton = "<a class='waves-effect waves-light btn light-green' style='position: relative; float: left; margin-right: 7.5px;' href='" + wikiURL + "' id=wiki-button target='_blank'>Wikipedia</a>";

        var travelButton = "<a class='waves-effect waves-light btn light-green' style='position: relative; float: left; margin-right: 7.5px;' href='" + travelURL + "' id=travel-button target='_blank'>Travelocity</a>";

        var mapButton = $("<a class='waves-effect waves-light btn light-green' style='position: relative; float: left; margin-right: 7.5px;' href='" + mapURL + "' id=map-button target='_blank'>Mapquest</a>");

        var weatherButton = $("<a class='waves-effect waves-light btn light-green' style='position: relaive; float: left; margin-right: 7.5px;' href='" + weatherURL + "' id=weather-button target='_blank'>Weather</a>");

        // Display buttons
        $("#buttonDiv").append(wikiButton);
        $("#buttonDiv").append(travelButton);
        $("#buttonDiv").append(mapButton);
        $("#buttonDiv").append(weatherButton);
    }
}

// Capitalizes each word in a city name
function capitalize(str) {
    var sep = str.split(" ");
    for (i = 0; i < sep.length; i++) {
        arr.push(sep[i][0].toUpperCase() + sep[i].slice(1));
    }
    return arr.join(" ");
}

// Replaces spaces in a city name with "-" or "%20" delimeter
function delimitCity(del) {
    var tempCity = "";
    for (var i = 0; i < arr.length - 1; i++) {
        tempCity = tempCity.concat(arr[i].concat(del));
    }
    tempCity = tempCity.concat(arr[arr.length - 1]);
    return tempCity;
}

// Hides the search results when the city or state name are changed
function hideResults() {
    $("#contentHeader").hide();
    $("#mainContent").hide();
    closeElement();
    $(table).empty();
}

// Closes an element when input data is modified
function closeElement() {
    if (element != "") {
        instances[0].close(element);
        $(table).empty();
        element = "";
    }
}

// Fetches the data from ticketmaster
function fetch() {

    // Gets id of event type
    element = $(this).attr("id");
    
    // If user is opening an element, fetches data
    if (document.getElementById(element).parentElement.className == "") {

        console.log("fetch");

        // Retrieves the event type, startDate and endDate
        var eventType = $(this).text().toLowerCase();
        startDate = $("#firstDate").val();
        endDate = $("#secondDate").val();

        // Sets the table variable for use is closing elements and displaing results
        table = "#" + eventType + "Table";

        // If startDate after endDate empty table, closes element, and displays modal
        if (startDate > endDate) {
            $("#errorMessage").text("Date of Departure must be after Date of Arrival");
            $('.modal').modal({ dismissible: true });
            $("#errorModal").modal("open");
        }
        else {
            // Sets up the query URL based on the input data and event type
            var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?city=" + city + "&stateCode=" + state + "&startDateTime=" + startDate + "T00%3A00%3A00Z&endDateTime=" + endDate + "T23%3A59%3A00Z&keyword=" + eventType + "&sort=date,asc&apikey=FJe0EUZsiu36JGLaKJ0OTRG6MUalTIbh";

            //Makes the API call
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {
                if (response.page.totalElements > 0) {
                    var results = response._embedded;

                    // Empties current contents of table
                    $(table).empty();

                    // Displays the API results
                    displayEvents(results);
                }
            });
        }
    }
}

// Displays the API results in a table
function displayEvents(results) {
   
    // Loops through the results array
    for (var i = 0; i < results.events.length; i++) {

        // Converts date and time
        var eventDateConverted = moment(results.events[i].dates.start.localDate).format("MM/DD/YYYY");
        var eventTimeConverted = moment(results.events[i].dates.start.localTime, "HH:mm:ss").format("hh:mm a");

        // Creates a button inside of the table for more info
        var moreInfoButton = $("<a class='waves-effect waves-light btn light-green' style='float:right;' href='" + results.events[i].url + "' target='_blank'>Link</a>");

        // Creates a new row in the table
        var eventtr = $("<tr>");

        // Creates a new td for each category of data
        var eventDate = $("<td>").html(eventDateConverted);
        var eventTime = $("<td>").html(eventTimeConverted);
        var eventName = $("<td>").html(results.events[i].name);
        var eventLocation = $("<td>").html(results.events[i]._embedded.venues[0].name);
        var eventLink = $("<td>").html(moreInfoButton);

        // If time is undefined, display "Not listed"
        if (results.events[i].dates.start.localTime == undefined) {
            $(eventTime).text("Not listed");
        }

        // Appends the new tds to the row
        eventtr.append(eventDate);
        eventtr.append(eventTime);
        eventtr.append(eventName);
        eventtr.append(eventLocation);
        eventtr.append(eventLink);

        // Appends the row to the table
        $(table).append(eventtr);
    }
}