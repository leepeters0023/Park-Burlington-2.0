function midPoint(latitude1, longitude1, latitude2, longitude2) {
    var DEG_TO_RAD = Math.PI / 180;     // To convert degrees to radians.
  
    // Convert latitude and longitudes to radians:
    var lat1 = latitude1 * DEG_TO_RAD;
    var lat2 = latitude2 * DEG_TO_RAD;
    var lng1 = longitude1 * DEG_TO_RAD;
    var dLng = (longitude2 - longitude1) * DEG_TO_RAD;  // Diff in longtitude.
  
    // Calculate mid-point:
    var bx = Math.cos(lat2) * Math.cos(dLng);
    var by = Math.cos(lat2) * Math.sin(dLng);
    var lat = Math.atan2(
        Math.sin(lat1) + Math.sin(lat2),
        Math.sqrt((Math.cos(lat1) + bx) * (Math.cos(lat1) + bx) + by * by));
    var lng = lng1 + Math.atan2(by, Math.cos(lat1) + bx);
  
    // new google.maps.LatLng
    let latOutput = lat / DEG_TO_RAD
    let lngOutput = lng / DEG_TO_RAD
    return ([latOutput, lngOutput]);
  };

  console.log(midPoint(-73.212854,
    44.477158,-73.213771,
    44.477128))