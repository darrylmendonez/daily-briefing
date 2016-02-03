$(document).ready(function() { 

  //Updated the Events from inputted location upon hitting ENTER key
  $("#selected-city").keypress(function(e){
    if (e.which == 13) {
      setTimeout(function(){
        $("#tableBody").empty();
        
        googleApiSuccessHandlerEventbrite();
      },500)  
    }
  });


  //Builds the table of events from inputted location
  function buildTable(events) {  
    
    var newTr = $("<tr>");
    var newTd = $("<td>")
    var eventLink =$("<a>").attr("href", events.url).attr("target", "_blank");
    var eventName = $("<h5>").html(events.name.text).addClass("h-events");
    var eventDescription = $("<p>").html(events.description.text).addClass("p-events");
    var eventTime = $("<h4>").html(events.start.local);

    if(events.logo === null || events.logo.url === null){
      var eventImg = $("<img>").attr("src", "https://www.bananga.com/images/default-product.png").addClass("responsive-img event-title-img");
    }else{
      var eventImg = $("<img>").attr("src", events.logo.url ).addClass("responsive-img");
    }
    
    newTr
      .append(newTd
      .append(eventImg)
      .append(eventLink.append(eventName))
      .append(eventDescription))
      
    return newTr;
  }
  //Function to use geoLocation and perform AJAX request to get events 1km from inputed location
  window.googleApiSuccessHandlerEventbrite = function () {
    var eventBriteUrl = "https://www.eventbriteapi.com/v3/";
    var token = "OO4THRQ4RMB522E4DLLG";
    $.ajax({
      type: "GET",
      url: eventBriteUrl + "events/search/?location.within=10km&location.latitude="+geoLocation.lat+"&location.longitude="+geoLocation.lng+"&token="+token,
      success: function(response){
        eventBriteSuccessHandler(response);
      }
      
    });
  }

  function eventBriteSuccessHandler(response) { 
    var locationEvents = response.events;
    for(var i = 0; i < 15; i++) {  
      var newTableBody = buildTable(locationEvents[i]);
      $("#tableBody").append(newTableBody);
      
    }
  };

//resize the event content to prevent horizontal scrolling at page load
  setTimeout(function(){
    if ($(window).width() < 408){
      $(".p-events").width($(window).width() - 110);
    }
  }, 3000)
  
//resize the event content when window size is changed below a certain width
  $(window).resize(function(){
    if ($(window).width() < 408){
      $(".p-events").width($(window).width() - 110);
    }
  });




});