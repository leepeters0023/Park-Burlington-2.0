const config = {
  apiKey: "AIzaSyCJ_q627N1dryTYbcSjE4d-4jfsJJg5VcY",
  authDomain: "park-burlington.firebaseapp.com",
  databaseURL: "https://park-burlington.firebaseio.com",
  projectId: "park-burlington",
  storageBucket: "park-burlington.appspot.com",
  messagingSenderId: "474825299090",
  appId: "1:474825299090:web:d06b7eb22ba0309571c24b",
  measurementId: "G-HDKTL5YR29"
};

firebase.initializeApp(config)

let database = firebase.database()
let ref = database.ref()

async function makeQuery() {
    let myVar = await ref.once('value')
      .then(function(dataSnapshot) {
        let info = dataSnapshot.val()
        let keys = Object.keys(info)
        for (var i = 0; i < keys.length; i++) {
          let k = keys[i]
          let name = info[k].name
          let coords = info[k].coordinates
          let descrip = info[k].description
        }
        return dataSnapshot.val();
      });
      return myVar;
  }

//Error Message if you cant get in-------------------------
function errData(data) {
    console.log('Error!')
    console.log(err)
}
//------------------------------------------------------------

async function initMap() {
  
  //Fetch geojson
  const mapData = await fetch("./BurlingtonParkingMap.geojson").then( res => res.json()).then( res => res)
  console.log(mapData)

  //Define lat lng location of the center of downtown Burlington
  const burlingtonCenter = {lat: 44.478081, lng: -73.215}
  
  //Define a 1.5 mile (2414.02) circle around downtown Burlington
  const circle = new google.maps.Circle(
    {center: burlingtonCenter, radius: 2414.02});
let myInfo = await makeQuery()
console.log({myInfo});

  //Define max lat lng view limits of the map
  const viewLimit = {
    north: 44.527929,
    south: 44.424518,
    west: -73.269027,
    east: -73.151240,
  }
  //Initialize map with some controls disabled
  let map = new google.maps.Map(document.getElementById('map'), {
    center: burlingtonCenter,
    zoom: 15.3,
    fullscreenControl: false,
    mapTypeControl: false,
    restriction: {
        latLngBounds: viewLimit,
        strictBounds: false,
      },
    styles: [
      {
        featureType: "administrative",
        elementType: "geometry",
        stylers: [
          {
            visibility: "off"
          }
        ]
      },
      {
        featureType: "poi",
        stylers: [
          {
            visibility: "off"
          }
        ]
      },
      {
        featureType: "road",
        elementType: "labels.icon",
        stylers: [
          {
            visibility: "off"
          }
        ]
      },
      {
        featureType: "road.arterial",
        elementType: "geometry.fill",
        stylers: [
          {
            visibility: "off"
          }
        ]
      },
      {
        featureType: "transit",
        stylers: [
          {
            visibility: "off"
          }
        ]
      },
      {
        featureType: "transit.station.bus",
        elementType: "labels.icon",
        stylers: [
          {
            visibility: "on"
          }
        ]
      }
    ]
    
  });
    
  // Import parking map geojson file

  // add polygons to map from FireBase
  let state = {
    "name": [],
    "coords" : []
  }

myInfo.forEach((item) => {
  let path = item.coordinates.split('0,')
  let newPath = path.map((item) => {
    let coordPair = item.split(',')
    return {lat: Number(coordPair[1]), lng: Number(coordPair[0])}
    
  })
  
  let polygonLayer = new google.maps.Polygon({
    paths: newPath,
    strokeColor: '#FF0000', // here we'll refer back to the object so item.whatever
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35
  });
  polygonLayer.setMap(map);
})

  let keys = Object.keys(myInfo)
        for (var i = 0; i < keys.length; i++) {
          let k = keys[i]
          state.name.push(myInfo[k].name)
          state.coords.push(myInfo[k].coordinates)
          let descrip = myInfo[k].description
        }

 

  // Import line/polygon styles from mapData objects
  map.data.setStyle(function(feature) {
    let fillC = feature.getProperty('fill');
    let fillO = feature.getProperty('fill-opacity')
    let strokeC = feature.getProperty('stroke')
    let strokeO = feature.getProperty('stroke-opacity')
    let strokeW = feature.getProperty('stroke-width')
    let iconImg = feature.getProperty('icon')
    
    return {
      fillColor: fillC,
      fillOpacity:  fillO,
      strokeColor: strokeC,
      strokeOpacity: strokeO,
      strokeWeight: 3,
      icon: iconImg,
    };
  });

  //Create info window cards and add click listeners to each parking asset
  let infowindow = new google.maps.InfoWindow({
    content: ""
  });
  map.data.addListener('click', function(event) {
    console.log(event)
    let name = event.feature.getProperty('name');
    let description = event.feature.getProperty('description');
    let html = '<strong>'+ name + '</strong>' + '<br><br>' + description;
    infowindow.setContent(html); // show the html variable in the infowindow
    infowindow.setPosition(event.latLng);
    infowindow.setOptions({
      pixelOffset: new google.maps.Size(0, 0)
    }); // move the infowindow up slightly to the top of the marker icon
    infowindow.open(map);
  });

  //Get searchbox element and fix it to top left of screen
  let card = document.getElementById('pac-card');
  let input = document.getElementById('pac-input');
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);

  //Initialize autocomplete function in the searchbar
  let autocomplete = new google.maps.places.Autocomplete(input);
  
 // Limit autocomplete results to within a 2 mile (3218.688 meter) circle of downtown Burlington.
  autocomplete.setBounds(circle.getBounds());
  autocomplete.setOptions({strictBounds: true});
  
  // Set the data fields to return when the user selects a place.
  autocomplete.setFields(
      ['address_components', 'geometry', 'icon', 'name']);

  let addressinfowindow = new google.maps.InfoWindow();
  let infowindowContent = document.getElementById('infowindow-content');
  addressinfowindow.setContent(infowindowContent);
  let marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });

  autocomplete.addListener('place_changed', function() {
    infowindow.close();
    marker.setVisible(false);
    let place = autocomplete.getPlace();
    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
    //   window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);  // Why 17? Because it looks good.
    }
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    let address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }

    infowindowContent.children['place-icon'].src = place.icon;
    infowindowContent.children['place-name'].textContent = place.name;
    infowindowContent.children['place-address'].textContent = address;
    addressinfowindow.open(map, marker);
  });

}