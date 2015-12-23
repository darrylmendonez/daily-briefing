// Scripts for Daily Briefing

/* ======================================================================
  GLOBAL VARIABLES
  =====================================================================*/
var geoLocation = {lat: 40.7127837, lng: -74.0059413};


$(document).ready(function(){

  /* ======================================================================
   NAVIGATION
   ===================================================================== */

  // To initiate side Nav for mobile devices
  $(".button-collapse").sideNav({ 
    menuWidth: 100 // So icons appear vertically instead of horizontally
  });

  // Smooth Scrolling from Nav Links to sections
  $('.scrollspy').scrollSpy();

  $(function() {
     var scroll_start = 0;
     
     $(window).scroll(function() { 
        scroll_start = $(this).scrollTop();
        if(scroll_start > 435) {
            $('nav').css('background-color', 'rgba(0,53,95,1)');
         } else {
            $('nav').css('background-color', 'transparent');
         }
     });
  });

  /* ======================================================================
   SLIDER AREA
   ===================================================================== */

  // Slider
  $('.slider').slider({full_width: true});


  // this event listener will wait for the search icon to be pressed and grab the value of the input field for selected city
  $("#search-button").on("click", function(){
    ajaxReqForLatLon();
    weatherData();
  });

  /* ======================================================================
   TRAFFIC
   ===================================================================== */

  // this will make an AJAX request to google API and upon success, call the googleApiSuccessHandler
  function ajaxReqForLatLon(){
    var userRequestedLocation = selectedCity();
    var googleApiURL = "https://maps.googleapis.com/maps/api/geocode/json?address="
    googleApiURL += userRequestedLocation;
    googleApiURL += "&key=AIzaSyBL0kULWrl9S6CMnmuzn8acUeNCcbBLgDs"
    console.log(googleApiURL);
    $.ajax({
      type: "GET",
      url: googleApiURL,
      success: function(response){
        geoLocation = googleApiSuccessHandler(response);
      },
      error: function(jqXHR, textStatus, errorThrown){
        console.log(errorThrown);
      }
    });
  }
  // function will take the response from the AJAX request and take the geolocation
  function googleApiSuccessHandler(response){
    var geoLocation = response.results[0].geometry.location;
    console.log(geoLocation);
    requestForecast();
    console.log("geoLocation.lat = " + geoLocation.lat);
    console.log("geoLocation.lng = " + geoLocation.lng);
    console.log("forecastApiURL = " + forecastApiURL);
    return geoLocation;
  }

  // function will return the city entered by the user
  function selectedCity() {
    var city = $("#selected-city").val().trim();
    if (city.length === 0) {
      // Animate placeholder text if user doesn't type in a city
      $("#selected-city").addClass("animated shake");
      $("#selected-city").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
        $("#selected-city").removeClass("animated shake");
      });
      return;
    };
    return city;
  }

  // this event listener will wait for the enter button to be pressed and alert the value in the field
  $("#selected-city").keypress(function(e){
    if (e.which == 13) {
      ajaxReqForLatLon();
      setTimeout(function(){
        initMap(geoLocation);
      }, 500);
    }
  });

  /*======================================================================
    MAP SETUP UPON PAGE LOAD
    ====================================================================*/

  // A timeout was used because on page load, the initMap function generates an error
  setTimeout(function(){
    initMap(geoLocation);
  }, 500);

  function initMap(geoLocation) {
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: geoLocation
    });
    var trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);
  }

  /*======================================================================
    WEATHER
    ====================================================================*/

  // forecast.io's URL format: 
  // https://api.forecast.io/forecast/APIKEY/LATITUDE,LONGITUDE

  function requestForecast() {
    var forecastApiKey = "b8d3aced4b8b6952a488c8cd6b49c72a";
    var forecastApiURL = "https://api.forecast.io/forecast/";
    forecastApiURL += forecastApiKey + "/";
    forecastApiURL += geoLocation.lat + "," + geoLocation.lng;
    console.log(forecastApiURL);
    $.ajax({
      type: "GET",
      url: forecastApiURL,
      success: function(response){
        var weatherSummary = response.currently.summary;
        var weatherIcon = response.currently.icon;
      },
      error: function(jqXHR, textStatus, errorThrown){
        console.log(errorThrown);
        console.log("Error: Function requestForecast isn't successful.")
      }
    });
  };

  requestForecast();

  var weatherData = function() {
    var apiKey = 'b8d3aced4b8b6952a488c8cd6b49c72a';
    var url = 'https://api.forecast.io/forecast/';
    var lati = geoLocation.lat;
    var longi = geoLocation.lat;
    var data;
    $.getJSON(url + apiKey + "/" + lati + "," + longi + "?callback=?", function(data) {
      console.log("geoLocation.lat = " + geoLocation.lat);
      console.log("geoLocation.lng = " + geoLocation.lng);
      $('#weather').html("Weather Summary: " + data.currently.summary + data.currently.icon + " Current Temperature: " + data.currently.temperature);
    })
  }; //Gotta figure out how to access geoLocation variable. You have to put this function in the same scope as the geoLocation var.

  weatherData();


}); // End document ready function
