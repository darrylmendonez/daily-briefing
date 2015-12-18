// Scripts for Daily Briefing

$(document).ready(function(){

  // To initiate side Nav for mobile devices
  $(".button-collapse").sideNav({ 
    menuWidth: 100 // So icons appear vertically instead of horizontally
  });

  // Slider
  $('.slider').slider({full_width: true});






    // this event listener will wait for the enter button to be pressed and alert the value in the field
  $("#selected-city").keypress(function(e){
    var x = selectedCity();
    if (e.which == 13) {
      alert(x);
    }
  });


  // function will return the city entered by the user
  function selectedCity() {
    var selectedCity = $("#selected-city").val().trim();
    return selectedCity;
  }

}); // End document ready function


// To Do List:
// Fill this out as you find issues with your code that you need to get back to later.

