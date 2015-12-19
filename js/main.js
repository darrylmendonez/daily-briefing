// Scripts for Daily Briefing

$(document).ready(function(){

  /* ======================================================================
   NAVIGATION
   ===================================================================== */

  // To initiate side Nav for mobile devices
  $(".button-collapse").sideNav({ 
    menuWidth: 100 // So icons appear vertically instead of horizontally
  });

  /* ======================================================================
   SLIDER AREA
   ===================================================================== */

  // Slider
  $('.slider').slider({full_width: true});

  // this event listener will wait for the enter button to be pressed and alert the value in the field
  $("#selected-city").keypress(function(e){
    var userSelectedCity = selectedCity();
    if (e.which == 13) {
      ajaxReqForLatLon();
    }
  });

  // this event listener will wait for the search icon to be pressed and grab the value of the input field for selected city
  $("#search-button").on("click", function(){
    var userSelectedCity = selectedCity();
    ajaxReqForLatLon();
  });


  // function will return the city entered by the user
  function selectedCity() {
    var selectedCity = $("#selected-city").val().trim();
    if (selectedCity.length === 0) {
      return;
    };
    return selectedCity;
  }

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
      success: googleApiSuccessHandler,
      error: function(jqXHR, textStatus, errorThrown){
        console.log(errorThrown);
      }
    });
  }
  // function will take the response from the AJAX request and take the geolocation
  function googleApiSuccessHandler(response){
    var geoLocation = response.results[0].geometry.location;
    initMap(geoLocation);
  }

  // function will initiate the map on the DOM and update when a new location is selected
  function initMap(geoLocation) {
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: geoLocation
    });
    var trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);
  }

}); // End document ready function


function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
    center: {lat: -34.397, lng: 150.644}
  });
}

// To Do List:
// Fill this out as you find issues with your code that you need to get back to later.
<<<<<<< HEAD
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 8,
      center: {lat: 40.7053111, lng: -74.2581875}
    });
  }
=======

>>>>>>> e48284f455b80143ecbdfe0857b848b48237f9ad
