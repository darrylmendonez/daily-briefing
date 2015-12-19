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
    var userSelectedCity = selectedCity();
    if (e.which == 13) {
      alert(userSelectedCity);
    }
  });

  // this event listener will wait for the search icon to be pressed and grab the value of the input field for selected city
  $("#search-button").on("click", function(){
    var userSelectedCity = selectedCity();
    alert(userSelectedCity);
  });


  // function will return the city entered by the user
  function selectedCity() {
    var selectedCity = $("#selected-city").val().trim();
    if (selectedCity.length === 0) {
      return;
    };
    return selectedCity;
  }

}); // End document ready function


// To Do List:
// Fill this out as you find issues with your code that you need to get back to later.

