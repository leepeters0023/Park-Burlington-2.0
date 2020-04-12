//Firebase Configuration

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

var database = firebase.database()
var ref = database.ref()

ref.on('value', gotData, errData)


//Accesses the information from firebase
//and lists it in key order by name, descrip and coords
function gotData(data) {
    // console.log(data.val())
    let info = data.val()
    let keys = Object.keys(info)
    console.log(keys)
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i]
        var name = info[k].name
        var coords = info[k].coordinates
        var descrip = info[k].description
    console.log(name, coords, descrip)
            
    // Below creates list of everything from database and print in html:
        // var li = document.createElement('li')
        // li.innerHTML = (k + ') ' + name + ': \n' +
        //     descrip + '\n ' + '\n'+coords)
        // document.body.appendChild(li)

    }
}
//Error Message if you cant get in-------------------------
function errData(data) {
    console.log('Error!')
    console.log(err)
}



//------------------------------------------------------------

async function initMap() {
  //Fetch geojson
  let togglePolyLayer = document.getElementById('togglePolygons')
  let polyLayerOn = 'off'
  let toggleLineStringLayer = document.getElementById('toggleLineString')
  let lineStringLayerOn = 'off'

  const linestringData = await fetch("./BurlingtonParkingLineString.geojson")
      .then(res => res.json())
      .then(res => res)
  const polygonData = await fetch("./BurlingtonParkingPolygon.geojson")
      .then(res => res.json())
      .then(res => res)
      

  //Define lat lng location of the center of downtown Burlington
  const burlingtonCenter = {lat: 44.478081, lng: -73.215}
  
  //Define a 1.5 mile (2414.02) circle around downtown Burlington
  const circle = new google.maps.Circle(
    {center: burlingtonCenter, radius: 2414.02});

  //Define max lat lng view limits of the map
  const viewLimit = {
    north: 44.527929,
    south: 44.424518,
    west: -73.269027,
    east: -73.151240,
 }

  //Initialize map with some controls disabled
  const map = new google.maps.Map(document.getElementById('map'), {
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
    
  let polyLayer = new google.maps.Data();
  let lineStringLayer = new google.maps.Data();

  // Create layers
  lineStringLayer.addGeoJson(linestringData);
  polyLayer.addGeoJson(polygonData);

  // set layers on map
  lineStringLayer.setMap(map);
  polyLayer.setMap(map);

  // Set styles for data layers
  polyLayer.setStyle(function (feature) {
      let fillC = feature.getProperty('fill')
      let fillO = feature.getProperty('fill-opacity')
      let strokeC = feature.getProperty('stroke')
      let strokeO = feature.getProperty('stroke-opacity')
      let strokeW = feature.getProperty('stroke-width')

      return {
          fillColor: fillC,
          fillOpacity: fillO,
          strokeColor: strokeC,
          strokeOpacity: strokeO,
          strokeWeight: strokeW,
      }
  })

  lineStringLayer.setStyle(function (feature) {
      let fillC = feature.getProperty('fill');
      let fillO = feature.getProperty('fill-opacity')
      let strokeC = feature.getProperty('stroke')
      let strokeO = feature.getProperty('stroke-opacity')
      let strokeW = feature.getProperty('stroke-width')

      return {
          fillColor: fillC,
          fillOpacity: fillO,
          strokeColor: strokeC,
          strokeOpacity: strokeO,
          strokeWeight: strokeW,
      };
  });


  
  togglePolyLayer.addEventListener('click', function () {
      console.log(polyLayerOn)
      if (polyLayerOn === 'off') {
          polyLayer.setStyle({ visible: false })
          polyLayerOn = 'on'
      } else if (polyLayerOn === 'on') {
          polyLayer.setStyle(function (feature) {
              let fillC = feature.getProperty('fill')
              let fillO = feature.getProperty('fill-opacity')
              let strokeC = feature.getProperty('stroke')
              let strokeO = feature.getProperty('stroke-opacity')
              let strokeW = feature.getProperty('stroke-width')
      
              return {
                  fillColor: fillC,
                  fillOpacity: fillO,
                  strokeColor: strokeC,
                  strokeOpacity: strokeO,
                  strokeWeight: strokeW,
              }
          })
          polyLayerOn = 'off'
      }
  });

  toggleLineStringLayer.addEventListener('click', function () {
      console.log(lineStringLayerOn)
      if (lineStringLayerOn === 'off') {
          lineStringLayer.setStyle({ visible: false })
          lineStringLayerOn = 'on'
      } else if (lineStringLayerOn === 'on') {
          lineStringLayer.setStyle(function (feature) {
              let fillC = feature.getProperty('fill')
              let fillO = feature.getProperty('fill-opacity')
              let strokeC = feature.getProperty('stroke')
              let strokeO = feature.getProperty('stroke-opacity')
              let strokeW = feature.getProperty('stroke-width')
      
              return {
                  fillColor: fillC,
                  fillOpacity: fillO,
                  strokeColor: strokeC,
                  strokeOpacity: strokeO,
                  strokeWeight: strokeW,
              }
          })
          lineStringLayerOn = 'off'
      }
  });


  //Create info window cards and add click listeners to each parking asset
  var infowindow = new google.maps.InfoWindow({
    content: ""
  });
  map.data.addListener('click', function(event) {
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
  var card = document.getElementById('pac-card');
  var input = document.getElementById('pac-input');
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);

  //Initialize autocomplete function in the searchbar
  var autocomplete = new google.maps.places.Autocomplete(input);
  
 // Limit autocomplete results to within a 2 mile (3218.688 meter) circle of downtown Burlington.
  autocomplete.setBounds(circle.getBounds());
  autocomplete.setOptions({strictBounds: true});
  
  // Set the data fields to return when the user selects a place.
  autocomplete.setFields(
      ['address_components', 'geometry', 'icon', 'name']);

  var addressinfowindow = new google.maps.InfoWindow();
  var infowindowContent = document.getElementById('infowindow-content');
  addressinfowindow.setContent(infowindowContent);
  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });

  autocomplete.addListener('place_changed', function() {
    infowindow.close();
    marker.setVisible(false);
    var place = autocomplete.getPlace();
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

    var address = '';
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