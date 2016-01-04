$(document).ready(function(){
  
  //click the go button

  $("#go").click(function(){

    //get width of cars
    var carWidth = $("#car1").width();

    //get width of racetrack
    var racetrackWidth = $(window).width()-carWidth;

    //generate random number between 1 and 5000
    var raceTime1 = Math.floor((Math.random()*5000) + 1 )
    var raceTime2 = Math.floor((Math.random()*5000) + 1 )

    //set flag variable to FALSE by default

    var isComplete = false;

    //set flag variable to FIRST by default
    var place = "first";

    //animate car 1
    $("car1").animate({
      //move car the width of the racetrack
      left: racetrackWidth
    }, raceTime1, function(){
        //animation is complete

        //run a function
    });



  });








}); //End document.ready