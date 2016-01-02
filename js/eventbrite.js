$(document).ready(function() { 

  // Allows NYC location to be default for Events
  googleApiSuccessHandler();

  //Updated the Events from inputted location upon hitting ENTER key
  $("#selected-city").keypress(function(e){
    if (e.which == 13) {
      setTimeout(function(){
        $("#").empty();
        $("#").append();
        googleApiSuccessHandler();
      },500)  
    }
  });


  // Builds the table of events from inputted location
  // function buildTable(photoData, number) {  
    
  //   var newDiv = $("<div>");
  //   var photoImg = $("<img>").attr("src", photoUrl);
    

  //   newDiv.append(photoImg);
  //   return newDiv;

  // }


  function googleApiSuccessHandler() {
    var eventBriteUrl = "https://www.eventbriteapi.com/v3/"
    var token = "OO4THRQ4RMB522E4DLLG"

    $.ajax({
      type: "GET",
      url: eventBriteUrl + "events/search/?location.latitude="+geoLocation.lat+"&location.longitude="+geoLocation.lng+"&token="+token
      success: function(response){
        eventBriteSuccessHandler(response);
      },
      error: function(jqXHR, textStatus, errorThrown){
        console.log(errorThrown);
      }
    });
  }

  function eventBriteSuccessHandler(response) { 
    var locationEvents = response.events;
    for(var i = 0; i < locationEvents.length; i++) {  
      var newCol = buildTable(locationEvents[i], i);
      $("").append(newCol);
    }





















});