$(document).ready(function(){








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


});