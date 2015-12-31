$(document).ready(function(){

  $("#selected-city").keypress(function(e){
    if (e.which == 13) {
      $(".location").html(($(this).val().trim()));
      $("#target-time").css("display", "flex");
      setTimeout(function(){
        getTimeZoneOfCity();
      }, 500)
    }
  });
  
  var now_utc;
  var timezone = "America/New_York";
  function getTimeZoneOfCity (){
    var now = new Date();
    var now_utc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
    now_utc = now_utc;
    var lat = geoLocation.lat;
    var lng = geoLocation.lng;
    var googleTimezoneApiURL = "https://maps.googleapis.com/maps/api/timezone/json?"
    googleTimezoneApiURL += "location=" + lat + "," + lng;
    googleTimezoneApiURL += "&timestamp=" + now_utc/1000 + "&key=AIzaSyDZQURt4o0BU3APcPrl91bvkQOYwCo99Lg&sensor=false"

    $.ajax({
      type: "GET",
      url: googleTimezoneApiURL,
      success: function(timezoneData){
        timezone = timezoneData.timeZoneId;
      }
      
    });
  }

  setInterval(function(){
    toTimeZone(timezone);
  }, 1000);

  function toTimeZone(zone) {
    var format = 'hh:mm:ss A';
    var time = moment().format(format);
    var timezoneTime =  moment(time, format).tz(zone).format(format);
    $("#local-time").text(time);
    $("#location-time").text(timezoneTime);
  }

});

 var newOffset;
// google timezone api key: AIzaSyDZQURt4o0BU3APcPrl91bvkQOYwCo99Lg