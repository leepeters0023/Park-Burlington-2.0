// get string from current URL like this
let params = new URLSearchParams(location.search);
params.get('name') # => "n1"
params.getAll('name') # => ["n1", "n2"]
// or like this
function getUrlName() {
  let params = window.location.hostname.split('.');
  return params[1]
}

// pass host name to a text search request in order to re center map
function initUrlSearch() {
  let request = {
    location: map.getCenter(),
    radius: '500',
    query: getUrlName()
  };
  var service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);
}
// Checks that the PlacesServiceStatus is OK, and adds a marker
// using the place ID and location from the PlacesService.
function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    let marker = new google.maps.Marker({
      map: map,
      place: {
        placeId: results[0].place_id,
        location: results[0].geometry.location
      }
    });
  }
}
google.maps.event.addDomListener(window, 'load', initialize);


// center map based on user's current location
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function (position) {
    var pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    infoWindow.setPosition(pos);
    infoWindow.setContent('Location found.');
    infoWindow.open(map);
    map.setCenter(pos);
  }, function () {
    handleLocationError(true, infoWindow, map.getCenter());
  });
} else {
  // Browser doesn't support Geolocation
  handleLocationError(false, infoWindow, map.getCenter());
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}
