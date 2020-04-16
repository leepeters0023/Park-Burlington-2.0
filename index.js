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
const database = firebase.database()
const ref = database.ref()

//ref.on('value', gotData, errData)

async function makeQuery() {

  let myVar = await ref.once('value')
    .then(function (dataSnapshot) {
      let info = dataSnapshot.val()
      let keys = Object.keys(info)

      for (let i = 0; i < keys.length; i++) {
        let k = keys[i]
        let name = info[k].name
        let coords = info[k].coordinates
        let descrip = info[k].description
      }
      return dataSnapshot.val()
    })

  return myVar
}

//let myinfo = makeQuery


//Accesses the information from firebase
//and lists it in key order by name, descrip and coords
function gotData(data) {
  console.log(data.val())
  let info = data.val()
  let keys = Object.keys(info)
  console.log(keys)
  for (let i = 0; i < keys.length; i++) {
    let k = keys[i]
    let name = info[k].name
    let coords = info[k].coordinates
    let descrip = info[k].description
    let payment = info[k].payment
    console.log(name, coords, descrip, payment)

  }

}

function errData(data) {
  console.log('Error!')
  console.log(err)
}
//------------------------------------------------------------

async function initMap() {



  //Define lat lng location of the center of downtown Burlington
  const burlingtonCenter = { lat: 44.478081, lng: -73.215 }

  //Define a 1.5 mile (2414.02) circle around downtown Burlington
  const circle = new google.maps.Circle(
    { center: burlingtonCenter, radius: 2414.02 });

  //Define max lat lng view limits of the map
  const viewLimit = {
    north: 44.527929,
    south: 44.424518,
    west: -73.269027,
    east: -73.151240,
  }

  //call database query and bring into initmap function

  let myInfo = await makeQuery()
  console.log({ myInfo });

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

  myInfo.forEach((item) => {

    let path = item.coordinates.split('0,')
    let stroke = item.stroke
    //let strokeOpacity = item.stroke-opacity
    let fill = item.fill
    let fillOpacity = item.fillOpacity
    let name = item.name
    let description = item.description
    let ownership = item.ownership
    let geometry = item.geometry
    let newPath = path.map((item) => {
      let coordPair = item.split(',')
      return { lat: Number(coordPair[1]), lng: Number(coordPair[0]) }

    })


    let polygonLayer = new google.maps.Polygon({
      paths: newPath,
      strokeColor: stroke,
      strokeWeight: 2,
      fillColor: fill,
      fillOpacity: fillOpacity,

    });

    polygonLayer.setMap(map);

    let infowindow = new google.maps.InfoWindow({
      content: ""
    });

    polygonLayer.addListener('click', function (event) {
      let html = '<strong>' + name + '</strong>' + '<br><br>' + description;
      infowindow.setContent(html)
      console.log(description)

      infowindow.setPosition(event.latLng);
      infowindow.setOptions({
        pixelOffset: new google.maps.Size(0, 0)
      }); // move the infowindow up slightly to the top of the marker icon
      infowindow.open(map);
      { passive: true }
    });

    // *****create on off functions

    function toggleHandicap() {
      if (name === 'Handicapped') {
        if (toggleHandicapLayer.checked === false) {
        polygonLayer.setVisible(false)
      } else if (toggleHandicapLayer.checked === true) {
        polygonLayer.setVisible(true)
      } }}

    function toggleMunicipleGarages() {
      if (ownership === 'municiple') {
        if (toggleMunicipleGaragesLayer.checked === false) {
        polygonLayer.setVisible(false)
      }else if (toggleMunicipleGaragesLayer.checked === true) {
      polygonLayer.setVisible(true)
    }}}

    function togglePrivateGarages() {
      if (ownership === 'private') {
        if (togglePrivateGaragesLayer.checked === false) {
        polygonLayer.setVisible(false)
      }else if (togglePrivateGaragesLayer.checked === true) {
      polygonLayer.setVisible(true)
    }}}


    // ******controls and filters*****************************************************************************************************

    // set variables for layer controls
    let toggleHandicapOnly = document.getElementById('toggleHandicapOnly')
    let toggleShowAll = document.getElementById('toggleShowAll')
    let toggleLoadingUnloadingOnly = document.getElementById('toggleLoadingUnloadingOnly')

    let toggleHandicapLayer = document.getElementById('toggleHandicap')
    let toggleMunicipleGaragesLayer = document.getElementById('toggleMunicipleGarages')
    let togglePrivateGaragesLayer = document.getElementById('togglePrivateGarages')
    let toggleSmartMetersLayer = document.getElementById('toggleSmartMeters')
    let toggleCoinOpLayer = document.getElementById('toggleCoinOpMeters')
    let toggleEVChargeLayer = document.getElementById('toggleEVCharge')
    let toggleMotorcycleLayer = document.getElementById('toggleMotorcycle')
    let toggleBusLargeVehicleLayer = document.getElementById('toggleBusLargeVehicle')
    let toggleResidentialLayer = document.getElementById('toggleResidential')
    let toggleLoadingUnloadingLayer = document.getElementById('toggleLoadingUnloading')

    toggleHandicapLayer.addEventListener('click', function () {
      toggleHandicap()
    });
    toggleMunicipleGaragesLayer.addEventListener('click', function () {
      toggleMunicipleGarages()
      console.log(toggleMunicipleGaragesLayer)
    });
    togglePrivateGaragesLayer.addEventListener('click', function () {
      togglePrivateGarages()
      console.log(togglePrivateGaragesLayer)
    });

  })


  //turn off residential and loading/unloading to start
  function startCondition() {
    document.getElementById("toggleResidential").click();
    document.getElementById("toggleLoadingUnloading").click();
  }
  startCondition()

  // set toggle function for Handicap Only button
  toggleHandicapOnly.addEventListener('click', function () {
    if (handicapLayerOn === 'off') {
      document.getElementById("toggleHandicap").click();
    };
    if (municipleGaragesLayerOn === 'on') {
      document.getElementById("toggleMunicipleGarages").click();
    };
    if (privateGaragesLayerOn === 'on') {
      document.getElementById("togglePrivateGarages").click();
    };
    if (smartMetersLayerOn === 'off') {
      document.getElementById("toggleSmartMeters").click();
    };
    if (coinOpLayerOn === 'off') {
      document.getElementById("toggleCoinOpMeters").click();
    };
    if (eVChargeLayerOn === 'off') {
      document.getElementById("toggleEVCharge").click();
    };
    if (motorcycleLayerOn === 'off') {
      document.getElementById("toggleMotorcycle").click();
    };
    if (busLargeVehicleLayerOn === 'off') {
      document.getElementById("toggleBusLargeVehicle").click();
    };
    if (residentialLayerOn === 'off') {
      document.getElementById("toggleResidential").click();
    };
    if (loadingUnloadingLayerOn === 'off') {
      document.getElementById("toggleLoadingUnloading").click();
    };

  });

  toggleShowAll.addEventListener('click', function () {
    if (handicapLayerOn === 'on') {
      document.getElementById("toggleHandicap").click();
    };
    if (municipleGaragesLayerOn === 'on') {
      document.getElementById("toggleMunicipleGarages").click();
    };
    if (privateGaragesLayerOn === 'on') {
      document.getElementById("togglePrivateGarages").click();
    };
    if (smartMetersLayerOn === 'on') {
      document.getElementById("toggleSmartMeters").click();
    };
    if (coinOpLayerOn === 'on') {
      document.getElementById("toggleCoinOpMeters").click();
    };
    if (eVChargeLayerOn === 'on') {
      document.getElementById("toggleEVCharge").click();
    };
    if (motorcycleLayerOn === 'on') {
      document.getElementById("toggleMotorcycle").click();
    };
    if (busLargeVehicleLayerOn === 'on') {
      document.getElementById("toggleBusLargeVehicle").click();
    };
    if (residentialLayerOn === 'on') {
      document.getElementById("toggleResidential").click();
    };
    if (loadingUnloadingLayerOn === 'on') {
      document.getElementById("toggleLoadingUnloading").click();
    };
  });

  // set toggle function for Show Loading/Unloading Only button
  toggleLoadingUnloadingOnly.addEventListener('click', function () {
    if (handicapLayerOn === 'off') {
      document.getElementById("toggleHandicap").click();
    };
    if (municipleGaragesLayerOn === 'off') {
      document.getElementById("toggleMunicipleGarages").click();
    };
    if (privateGaragesLayerOn === 'off') {
      document.getElementById("togglePrivateGarages").click();
    };
    if (smartMetersLayerOn === 'off') {
      document.getElementById("toggleSmartMeters").click();
    };
    if (coinOpLayerOn === 'off') {
      document.getElementById("toggleCoinOpMeters").click();
    };
    if (eVChargeLayerOn === 'off') {
      document.getElementById("toggleEVCharge").click();
    };
    if (motorcycleLayerOn === 'off') {
      document.getElementById("toggleMotorcycle").click();
    };
    if (busLargeVehicleLayerOn === 'off') {
      document.getElementById("toggleBusLargeVehicle").click();
    };
    if (residentialLayerOn === 'off') {
      document.getElementById("toggleResidential").click();
    };
    if (loadingUnloadingLayerOn === 'on') {
      document.getElementById("toggleLoadingUnloading").click();
    };

  });

  //******************************************************************************************* */
  let layersList = [
    handicapLayer,
    municipleGaragesLayer,
    privateGaragesLayer,
    smartMetersLayer,
    coinOpLayer,
    eVChargeLayer,
    motorcycleLayer,
    busLargeVehicleLayer,
    residentialLayer,
    loadingUnloadingLayer, 
  ]
  //Create info window cards and add click listeners to each parking asset
  var infowindow = new google.maps.InfoWindow({
    content: ""
  });
  for (layer of layersList) {
    layer.addListener('click', function (event) {
      let name = event.feature.getProperty('name');
      let description = event.feature.getProperty('description');
      let html = '<strong>' + name + '</strong>' + '<br><br>' + description;
      infowindow.setContent(html); // show the html variable in the infowindow
      infowindow.setPosition(event.latLng);
      infowindow.setOptions({
        pixelOffset: new google.maps.Size(0, 0)
      }); // move the infowindow up slightly to the top of the marker icon
      infowindow.open(map);
    });
    
  }

  let layerDataList = [
    handicapData,
    municipleGaragesData,
    privateGaragesData,
    smartMetersData,
    coinOpData,
    eVChargeData,
    motorcycleData,
    busLargeVehicleData,
    residentialData,
    loadingUnloadingData, 
  ]

  function addMarker(location, labelContent, map) {

    var marker = new google.maps.Marker({
      position: location,
      label: labelContent,
      map: map
    });
  }

  for (layer of layerDataList){
  
  let layerFeatures = layer.features
    
    for (feature of layerFeatures){
      let location = feature.properties.iconCoords
      let labelContent = feature.properties.price
      addMarker(location, labelContent, map)
      }
    }

  //Get searchbox element and fix it to top left of screen
  var card = document.getElementById('pac-card');
  var input = document.getElementById('pac-input');
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);

  //Initialize autocomplete function in the searchbar
  var autocomplete = new google.maps.places.Autocomplete(input);

  // Limit autocomplete results to within a 2 mile (3218.688 meter) circle of downtown Burlington.
  autocomplete.setBounds(circle.getBounds());
  autocomplete.setOptions({ strictBounds: true });

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

  autocomplete.addListener('place_changed', function () {
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
      map.setZoom(18);
      
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);  // Why 17? Because it looks good.
    }
    marker.setPosition(place.geometry.location);
    
    marker.setVisible(true);
//*********************************************************************************** */



        var icons = {
          parking: {
            icon: 'images/icons8-marker-32.png'
          }
        };

        var features = 
          {
            position: new google.maps.LatLng(-73.2171908, 44.4763264),
            type: 'parking'
          }
      

        // // Create markers.
      
        //   var marker = new google.maps.Marker({
        //     position: features.position,
        //     icon: icons.parking.icon,
        //     map: map
        //   });
       
      


//************************************************************************************** */
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

//******* Modal window for Filters ************************************************************* */
// Get the modal
let modal = document.getElementById("myModal");

// Get the button that opens the modal
let btn = document.getElementById("toggleFilters");

// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function () {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
  // *************************************************************************************

