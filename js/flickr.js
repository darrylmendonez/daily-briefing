$(document).ready(function() {  



  setTimeout(function(){
    $("#foo").slideme({
      arrows: true,
      itemsForSlide : 2,
      resizeable:{
          width: 990,
          height: 500,
      }
    });
  }, 1000);

  
  
  
  // Allows NYC location to be default for images
  googleApiSuccessHandler();


  // Shows images from the inputted location upon hitting ENTER key
  $("#selected-city").keypress(function(e){
    if (e.which == 13) {
      setTimeout(function(){
        $(".slideme").empty(); 
        googleApiSuccessHandler();
      },500)  
    }
  });


  // Builds the photo urls for all images from entered location then builds gallery
  function buildThumbnail(photoData) {  
    var photoUrl = "https://farm" + photoData.farm; 
    photoUrl += ".staticflickr.com/" + photoData.server;
    photoUrl += "/" + photoData.id;
    photoUrl += "_" + photoData.secret + ".jpg";

    var newLi = $("<li>");
    var photoImg = $("<img>").attr("src", photoUrl).addClass("col s6");
    

    newLi.append(photoImg);

    return newLi;

  }

  // Grabs the images from flickr based on user input
  function googleApiSuccessHandler() {
    var flickrApiUrl = "https://api.flickr.com/services/rest/?";
    var flickrApiParams = {
      api_key: "4878be0a0e72be523088855dc3771f33",
      method: "flickr.photos.search",
      format: "json",
      nojsoncallback: 1,
      lat: geoLocation.lat,
      lon: geoLocation.lng
    }
    
    $.ajax({
      type: "GET",
      url: flickrApiUrl + $.param(flickrApiParams),
      success: function(response){
        flickrSuccessHandler(response);
       } 
    });


  }
  // loops through all images and applies them into the HTML
  function flickrSuccessHandler(response) { 
    var locationPhotos = response.photos.photo; 
    for(var i = 0; i < 30; i++) {  
      var newCol = buildThumbnail(locationPhotos[i]);
      $(".slideme").append(newCol);

    }
  }
});