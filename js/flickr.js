$(document).ready(function() {  


  function buildThumbnail(photoData) {  //function to show thumbnails into HTML page
    var photoUrl = "https://farm" + photoData.farm; // assign photoUrl 
    photoUrl += ".staticflickr.com/" + photoData.server;
    photoUrl += "/" + photoData.id;
    photoUrl += "_" + photoData.secret + ".jpg";

    var colDiv = $("<div>").addClass("col-md-3");
    var thumbnailDiv = $("<div>").addClass("thumbnail")  ;
    var photoImg = $("<img>").attr("src", photoUrl).addClass("materialboxed");
    var captionDiv = $("<div>").addClass("caption");
    var picTitle = $("<p>").append(photoData.title);

    colDiv.append(thumbnailDiv
      .append(photoImg)
      .append(captionDiv
        .append(picTitle)
      )
    );

    return colDiv;

  }

  function googleApiSuccessHandler(response) {
    

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
      success: flickrSuccessHandler
    });


  }

  function flickrSuccessHandler(response) { //function running because the AJAX request was successful
    var locationPhotos = response.photos.photo; // assigning the results from AJAX request into locationPhotos
    for(var i = 0; i < locationPhotos.length; i++) {  // passing
      var newCol = buildThumbnail(locationPhotos[i]);
      $("#photosRow").append(newCol);

    }
  }
});