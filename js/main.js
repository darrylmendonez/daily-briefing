// Scripts for Daily Briefing

/* ======================================================================
  GLOBAL VARIABLES
  =====================================================================*/
var geoLocation = {lat: 40.7127837, lng: -74.0059413};
var city = "New York City"
// This autoscrolls to the clock when user enters city.
var autoScroll = function() {
  $("html, body").animate({
    scrollTop: $("#greeting-row").offset().top - 60
  }, 1250);
} // This is called within function ajaxReqForLatLon()

$(document).ready(function(){

  /* ======================================================================
   NAVIGATION
   ===================================================================== */

  // To initiate side Nav for mobile devices
  $(".button-collapse").sideNav({ 
    menuWidth: 86, // So icons appear vertically instead of horizontally
    closeOnClick: true
  });

  // Smooth Scrolling from Nav Links to sections
  $('.scrollspy').scrollSpy();

  $(function() {
    $(window).width();
    var width = $(window).width();
    var scroll_start = 0;
    var navColor = $('nav').css('background-color', 'rgba(0,53,95,1)');
    var navTransparent = $('nav').css('background-color', 'transparent');

    if(width <= 480){
      $(window).scroll(function() { 
        scroll_start = $(this).scrollTop();
        if(scroll_start > 140) {
          $('nav').css('background-color', 'rgba(0,53,95,1)');
        } else {
            $('nav').css('background-color', 'transparent');
        }
      });
    } else if((width >= 481) && (width <= 767)){
      $(window).scroll(function() { 
        scroll_start = $(this).scrollTop();
        if(scroll_start > 330) {
          $('nav').css('background-color', 'rgba(0,53,95,1)');
        } else {
            $('nav').css('background-color', 'transparent');
          }
       });
    } else {
      $(window).scroll(function() { 
        scroll_start = $(this).scrollTop();
        if(scroll_start > 435) {
          $('nav').css('background-color', 'rgba(0,53,95,1)');
        } else {
            $('nav').css('background-color', 'transparent');
          }
       });
    };
  });



  /* ======================================================================
   SLIDER AREA
   ===================================================================== */

  // Slider
  $('.slider').slider({full_width: true});

   // this event listener will wait for the enter button to be pressed and alert the value in the field
  $("#selected-city").keypress(function(e){
    if (e.which == 13) {
      ajaxReqForLatLon();
      setTimeout(function(){
        initMap(geoLocation);
      }, 500);
    }
  });

  // this event listener will wait for the search icon to be pressed and grab the value of the input field for selected city
  $("#search-button").on("click", function(){
    ajaxReqForLatLon();
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

    $.ajax({
      type: "GET",
      url: googleApiURL,
      success: function(response){
        geoLocation = googleApiSuccessHandler(response);
        weatherData();
      },
      error: function(jqXHR, textStatus, errorThrown){
        console.log(errorThrown);
      }
    });
    autoScroll(); // This autoscrolls to the clock when user enters city.
  }

  // function will take the response from the AJAX request and take the geolocation
  function googleApiSuccessHandler(response){
    var geoLocation = response.results[0].geometry.location;
    return geoLocation;
  }

  // function will return the city entered by the user
  function selectedCity() {
    city = $("#selected-city").val().trim();
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

  if ($(window).width() < 480){
    $("#map").height($("#map").width());
  }

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
      center: geoLocation,
      scrollwheel: false
    });
    var infoWindow = new google.maps.InfoWindow({map: map});

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        geoLocation = {lat: position.coords.latitude, lng: position.coords.longitude}
        infoWindow.setPosition(pos);
        infoWindow.setContent('Location found.');
        map.setCenter(pos);
      }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
      infoWindow.setPosition(pos);
      infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
    }

    var trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);
  }

  /*======================================================================
    WEATHER
    ====================================================================*/

  // forecast.io's URL format: 
  // https://api.forecast.io/forecast/APIKEY/LATITUDE,LONGITUDE

  var weatherData = function() {
    var apiKey = 'b8d3aced4b8b6952a488c8cd6b49c72a';
    var url = 'https://api.forecast.io/forecast/';
    var lati = geoLocation.lat;
    var longi = geoLocation.lng;
    var data;
    $.getJSON(url + apiKey + "/" + lati + "," + longi + "?callback=?", function(data) {
      $("#weather").html("&nbsp;&nbsp;Today: " + data.currently.summary + "<br />&nbsp;&nbsp;Current Temperature: " + data.currently.temperature.toFixed(0) + "&deg; F");
      var skycons = new Skycons({"color": "#E65100"});
      var currentWeatherIcon = data.currently.icon;

      switch (currentWeatherIcon) { 
        case 'clear-day': 
          skycons.add("weather-icon", Skycons.CLEAR_DAY);
          $("#weather-image").attr("src", "images/weather-images/clear-day.jpg");
          break;
        case 'clear-night': 
          skycons.add("weather-icon", Skycons.CLEAR_NIGHT);
          $("#weather-image").attr("src", "images/weather-images/clear-night.jpg");
          break;
        case 'partly-cloudy-day': 
          skycons.add("weather-icon", Skycons.PARTLY_CLOUDY_DAY);
          $("#weather-image").attr("src", "images/weather-images/partly-cloudy-day.jpg");
          break;    
        case 'partly-cloudy-night': 
          skycons.add("weather-icon", Skycons.PARTLY_CLOUDY_NIGHT);
          $("#weather-image").attr("src", "images/weather-images/partly-cloudy-night.jpg");
          break;
        case 'cloudy': 
          skycons.add("weather-icon", Skycons.CLOUDY);
          $("#weather-image").attr("src", "images/weather-images/cloudy.jpg");
          break;
        case 'rain': 
          skycons.add("weather-icon", Skycons.RAIN);
          $("#weather-image").attr("src", "images/weather-images/rain.jpg");
          break;
        case 'sleet': 
          skycons.add("weather-icon", Skycons.SLEET);
          $("#weather-image").attr("src", "images/weather-images/sleet.jpg");
          break;    
        case 'snow': 
          skycons.add("weather-icon", Skycons.SNOW);
          $("#weather-image").attr("src", "images/weather-images/snow.jpg");
          break;
        case 'wind': 
          skycons.add("weather-icon", Skycons.WIND);
          $("#weather-image").attr("src", "images/weather-images/wind.jpg");
          break;    
        case 'fog': 
          skycons.add("weather-icon", Skycons.FOG);
          $("#weather-image").attr("src", "images/weather-images/fog.jpg");
          break;
        // From forecast.io documentation: "Developers should ensure that a sensible default is defined, as additional values, such as hail, thunderstorm, or tornado, may be defined in the future."
        // Therefore default has been set to rain.
        default:
          skycons.add("weather-icon", Skycons.RAIN);
          $("#weather-image").attr("src", "images/weather-images/rain.jpg");
          break;
      }
      // Start animation
      skycons.play();
    })
  }; 

  weatherData();

  //Parallax function from Materializecss
  $(document).ready(function(){
    $('.parallax').parallax();
  });

  /*======================================================================
    NEWS
    ====================================================================*/

  $(".chevron-down").on("click", function(){
    alert("yo");
    $(".chevron-up").toggle();  
    $(".chevron-down").toggle();  
  });

  /*======================================================================
   LIKE COUNTER
  ====================================================================*/
  var likeCounter = new Firebase("https://fiery-heat-8606.firebaseio.com");

  likeCounter.child("counter").on("value", updateDiv);

  $("#like-counter-button").on("click", function() {
    // Heart animation on like button
    $("#heart-icon").addClass("zoomIn");
    setTimeout(function () { 
      $("#heart-icon").removeClass("zoomIn");
    }, 1000);
    // Increase like count by 1
    likeCounter.child("counter").transaction(function(currentValue) {
      return (currentValue || 0) + 1;
    })
  });

  // Reset like counter to 0.
  // 1. First uncomment the reset button in index.html on or about line 200. If it helps, search for 'reset-button' instead.
  // 2. Refresh local site or open local index.html in browser
  // 3. You should see the black reset button in the footer bar. Click to reset like counter to 0.
  // 4. Finally, comment out reset button.
  $("#reset-button").on("click", function() {
    likeCounter.remove();
    $("#number-of-likes").html("0");
  });

  function updateDiv(likeTotal) {
    $("#number-of-likes").html(likeTotal.val());
    if (likeTotal.val() === null) {
      $("#number-of-likes").html("0");
    }
  }

}); // End document ready function
