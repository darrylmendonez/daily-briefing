$(document).ready(function(){

  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var hour = date.getHours()*3600;
  var day = date.getDate();
  var minutes = date.getMinutes()*60;
  var seconds = date.getSeconds();
  var currentTime = hour + minutes + seconds;
  

  // clock settings
  var localClock = $(".local-clock").FlipClock({
    // options here
    clockFace: "TwelveHourClock"
  });

  localClock.start(function(){

  });
  setTimeout(function(){
    getTimeZoneOfCity();
  }, 10000)
  
  function getTimeZoneOfCity (){
    var now = new Date();
    var now_utc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
    now_utc = now_utc/1000;
    var lat = geoLocation.lat;
    var lng = geoLocation.lng;
    var googleTimezoneApiURL = "https://maps.googleapis.com/maps/api/timezone/json?"
    googleTimezoneApiURL += "location=" + lat + "," + lng;
    googleTimezoneApiURL += "&timestamp=" + now_utc + "&key=AIzaSyDZQURt4o0BU3APcPrl91bvkQOYwCo99Lg&sensor=false"

    $.ajax({
      type: "GET",
      url: googleTimezoneApiURL,
      success: function(timezoneData){
        console.log(timezoneData);
      }
      
    });
  }






});


// google timezone api key: AIzaSyDZQURt4o0BU3APcPrl91bvkQOYwCo99Lg