// Scripts for Daily Briefing

/* ==============================================================
  GLOBAL VARIABLES
  =============================================================*/
var geoLocation = {lat: 40.7127837, lng: -74.0059413}; //default geolocation
var city = "New York City" //default city
// This autoscrolls to the clock when user enters city.
var autoScroll = function() {
  if (city !== "") {
    $("html, body").animate({
      scrollTop: $("#weather-row").offset().top - 60
    }, 500);
  }
} // This is called within function ajaxReqForLatLon()

$(document).ready(function(){



   /* ============================================================
   PREVENT VIDEO LOAD ON MOBILE
   =========================================================== */
   var check = false;
      window.mobilecheck = function() {
      // Check for mobile here
      if (check === true) {
        // Device is mobile
        var sources = document.querySelectorAll('video#headerVideo source');
        // Define the video object this source is contained inside
        var video = document.querySelector('video#headerVideo');
        for(var i = 0; i<sources.length;i++) {
        sources[i].setAttribute('src', sources[i].getAttribute('data-src'));
        } 
      } else {
        video.load();  
    };
  };






  /* ============================================================
   NAVIGATION
   =========================================================== */

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

  /* ============================================================
   SLIDER AREA
   =========================================================== */

  // Slider
  $('.slider').slider({
    full_width: true,
    height: 500,
    indicators: false

    });



   // this event listener will wait for the enter button to be pressed and alert the value in the field
  $("#selected-city").keypress(function(e){
    if (e.which == 13) {
      ajaxReqForLatLon();
      setTimeout(function(){
        $("body").addClass("wrapper");
      }, 1000);
      setTimeout(function(){
        initMap(geoLocation);
      }, 500);
    }
  });

  // this event listener will wait for the search icon to be pressed and grab the value of the input field for selected city
  $("#search-button").on("click", function(){
    ajaxReqForLatLon();
  });

  // When user clicks search button it clears the input field and puts the focus on the input field.
  $(".fa-search").on("click", function(){
    $("#selected-city").val("").focus();
  });

  /* ============================================================
   TRAFFIC
   =========================================================== */

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
    $("#nav-location").addClass("capitalize");
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

  /*=============================================================
    MAP SETUP UPON PAGE LOAD
    ===========================================================*/

  // A timeout was used because on page load, the initMap function generates an error
  setTimeout(function(){
    initMap(geoLocation);
  }, 500);

  var triggerOnce = true; //so the initial location only happens once
  function initMap(geoLocation) {
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: geoLocation,
      scrollwheel: false
    });

    var infoWindow = new google.maps.InfoWindow({map: map});
    if (triggerOnce) { //will only run on page load
      triggerOnce = false;

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          geoLocation.lat = position.coords.latitude;
          geoLocation.lng = position.coords.longitude;
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          reverseGeocode(); //run this function to get city name for the other functions
          weatherData();
          googleApiSuccessHandlerFlickr();
          googleApiSuccessHandlerEventbrite();
          setTimeout(function(){
            bingNewsAPI(); //using a timeout so the city can update before the news will run
            $(".location").html(city);
            $("#in").html("in ");
          }, 500);
          infoWindow.setPosition(pos);
          infoWindow.setContent('You are here');
          map.setCenter(pos);
        }, function() {
          handleLocationError(true, infoWindow, map.getCenter());
        });
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
      }
    }
    
    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
      //These function calls will run using the default geolocation and city
      infoWindow.setPosition(pos);
      weatherData();
      bingNewsAPI();
      googleApiSuccessHandlerFlickr();
      googleApiSuccessHandlerEventbrite();
      // infoWindow.setContent(browserHasGeolocation ?
      //                         'Error: The Geolocation service failed.' :
      //                         'Error: Your browser doesn\'t support geolocation.');
    }

    var trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);
  }

  /*===========================================================
      REVERSE GEOCODE - will get the city name based on geocode
    =========================================================*/
  function reverseGeocode () {
    var googleRevGeoApiURL = "https://maps.googleapis.com/maps/api/geocode/json?latlng="
    googleRevGeoApiURL += geoLocation.lat + "," + geoLocation.lng;
    googleRevGeoApiURL += "&key=AIzaSyBL0kULWrl9S6CMnmuzn8acUeNCcbBLgDs"

    $.ajax({
      type: "GET",
      url: googleRevGeoApiURL,
      success: function(response){
        city = response.results[0].address_components[2].long_name; 
      },
      error: function(jqXHR, textStatus, errorThrown){
        console.log(errorThrown);
      }
    });
  }

  /*=============================================================
    WEATHER
    ===========================================================*/

  // forecast.io's URL format: 
  // https://api.forecast.io/forecast/APIKEY/LATITUDE,LONGITUDE

  var weatherData = function() {
    var apiKey = 'b8d3aced4b8b6952a488c8cd6b49c72a';
    var url = 'https://api.forecast.io/forecast/';
    var lati = geoLocation.lat;
    var longi = geoLocation.lng;
    var data;
    $.getJSON(url + apiKey + "/" + lati + "," + longi + "?callback=?", function(data) {
      $("#weather").html("&nbsp;&nbsp;Today: " + data.currently.summary + "<br />&nbsp;&nbsp;Currently: " + data.currently.temperature.toFixed(0) + "&deg; F" + "<br />&nbsp;&nbsp;Low: " + data.daily.data[0].temperatureMin.toFixed(0) + "&deg; F" + "<br />&nbsp;&nbsp;High: " + data.daily.data[0].temperatureMax.toFixed(0) + "&deg; F");
      var skycons = new Skycons({"color": "#f57c00"});
      var currentWeatherIcon = data.currently.icon;
      $("#weather-tomorrow").html("&nbsp;&nbsp;Tomorrow: " + data.daily.data[1].summary + "<br />&nbsp;&nbsp;Low: " + data.daily.data[1].temperatureMin.toFixed(0) + "&deg; F" + "<br />&nbsp;&nbsp;High: " + data.daily.data[1].temperatureMax.toFixed(0) + "&deg; F");
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
      } // End switch statement
      // Start animation
      skycons.play();
    })
  }; 

  //Parallax function from Materializecss
  $('.parallax').parallax();

  /*=============================================================
    NEWS
    ===========================================================*/

  $(".chevron-down").on("click", function(){
    alert("yo");
    $(".chevron-up").toggle();  
    $(".chevron-down").toggle();  
  });

  /*=============================================================
   LIKE COUNTER
  =============================================================*/
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
  // 1. First uncomment the reset button in index.html. You can search for 'reset-button' to find it faster.
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
