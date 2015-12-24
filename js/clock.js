$(document).ready(function(){

  $("#selected-city").keypress(function(e){
    if (e.which == 13) {
      setTimeout(function(){
        getTimeZoneOfCity();
      }, 1000)
    }
  });
  

  // clock settings
  var localClock = $(".local-clock").FlipClock({
    // options here
    clockFace: "TwelveHourClock"
  });

  

  //start the clock for the user's timezone
  localClock.start(function(){});
  
  var now_utc;
  function getTimeZoneOfCity (){
    var now = new Date();
    var now_utc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
    now_utc = now_utc;
    console.log(now_utc*1000);
    var lat = geoLocation.lat;
    var lng = geoLocation.lng;
    var googleTimezoneApiURL = "https://maps.googleapis.com/maps/api/timezone/json?"
    googleTimezoneApiURL += "location=" + lat + "," + lng;
    googleTimezoneApiURL += "&timestamp=" + now_utc/1000 + "&key=AIzaSyDZQURt4o0BU3APcPrl91bvkQOYwCo99Lg&sensor=false"

    $.ajax({
      type: "GET",
      url: googleTimezoneApiURL,
      success: function(timezoneData){
        locationTime(timezoneData.timeZoneId);
      }
      
    });
  }

  function locationTime (timeZone){
    // var localOffset = new Date().getTimezoneOffset();
    // console.log(localOffset);
    // // var newTime = new Date(moment().tz(timeZone).format("MMM DD, YYYY HH:MM:SS"));
    // var newOffset = moment.tz.zone(timeZone).offset();
    // console.log(newOffset);
    // var newOffset = newTime.getTimezoneOffset();
    // console.log(newOffset);
    // var diff = localOffset - newOffset;
    // console.log(diff);
    // var locationClock = $(".location-clock").FlipClock(diff, {
    //   clockFace: "TwelveHourClock"
    // });

    var newOffset = moment.tz(timeZone).format("Z");
    console.log(typeof(newOffset));

    $("#flipcountdownbox1").flipcountdown({
      size: "lg",
      tzoneOffset: newOffset
    });
  }


  

});

 var newOffset;
// google timezone api key: AIzaSyDZQURt4o0BU3APcPrl91bvkQOYwCo99Lg