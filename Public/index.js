// Set Window Height
// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);

// We listen to the resize event
window.addEventListener('resize', () => {
  // We execute the same script as before
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});

//***********Firebase Configuration ****************************************************************
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


//Error Handling Function-----

function errData(data) {
  console.log('Error!')
  console.log(err)
}

//-----------------------create base map------------------------

async function initMap() {



  //Define lat lng location of the center of downtown Burlington
  const burlingtonCenter = { lat: 44.478081, lng: -73.215 }

  //Define a 1.5 mile (2414.02 meter) circle around downtown Burlington
  const circle = new google.maps.Circle(
    { center: burlingtonCenter, radius: 2414.02 });

  //Define max lat lng view limits of the map
  const viewLimit = {
    north: 47,
    south: 41,
    west: -77.269027,
    east: -69.151240,
  }


  // some controls disabled
  let map = new google.maps.Map(document.getElementById('map'), {
    center: burlingtonCenter,
    zoom: 15.3,
    gestureHandling: "greedy",
    fullscreenControl: false,
    rotateControl: false,
    scaleControl: true,
    mapTypeControl: false,
    // mapTypeControlOptions: {
    //   position: google.maps.ControlPosition.BOTTOM_CENTER,
    // },
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

  //Get searchbox element and fix it to top left of screen
  let card = document.getElementById('pac-card');
  let input = document.getElementById('pac-input');
  let reset = document.getElementById('btnReset')
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);

  //Get map legend and fix it to bottom left of screen
  // let legend = document.getElementById("map-legend")
  // map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend);


  // call database query and bring into initmap function ***************************************************************************
  let myInfo = await makeQuery()
  let activeWindow = null
  console.log(myInfo)

  myInfo.forEach((item) => {
    let path = item.coordinates.split(',0,')
    let stroke = item.stroke
    let strokeOpacity = item.strokeopacity
    let fill = item.fill
    let fillOpacity = item.fillOpacity
    let icon = item.icon
    let name = item.name
    let latitude = item.latitude
    let longitude = item.longitude
    let center = item.center
    let rate = item.rate
    let description = item.description
    let ownership = item.ownership
    let geometry = item.geometry
    let polyline = item.polyline
    let parkMarker = './images/arrowtransparent.png'
    let image = './images/electric_vehicle.png'
    let newPath = path.map((item) => {
      let coordPair = item.split(',')
      return { lat: Number(coordPair[1]), lng: Number(coordPair[0]) }
    })



    //Adds charging station icons
    let markerLayer = new google.maps.Marker({
      position: null,
      icon: image,
    });
    if (latitude !== undefined) {
      markerLayer.setPosition({ lat: latitude, lng: longitude })
    }

    //add any polyline meter rows
    let polyLineLayer = new google.maps.Polyline({
      strokeColor: stroke,
      strokeWeight: 2,
      strokeOpacity: strokeOpacity
    })
    if (polyline === 'yes') {
      polyLineLayer.setPath(newPath)
    }

    // adds garages and lots - polygons and linestrings - parking meters
    let polygonLayer = new google.maps.Polygon({
      paths: null,
      strokeColor: stroke,
      strokeWeight: 2,
      fillColor: fill,
      fillOpacity: fillOpacity,
    });
    if (polyline === undefined && latitude === undefined) {
      polygonLayer.setPath(newPath)
    }

    //set all layers on the map
    polygonLayer.setMap(map);
    markerLayer.setMap(map);
    polyLineLayer.setMap(map);

    // create info-window for use when clicking parking asset
    let infowindow = new google.maps.InfoWindow({
      content: ""
    });

    // create small icons for show price on zoom in
    let priceIcon = new google.maps.Marker({
      position: null,
      icon: null,
      optimized: false,
    });
    
    priceIcon.addListener('click', function (event) {
      if (activeWindow != null) {
        activeWindow.close()
      }
      let html = '<strong>' + name + '</strong>' + '<br><br>' + description;
      infowindow.setContent(html)

      infowindow.setPosition(event.latLng);
      infowindow.setOptions({
        pixelOffset: new google.maps.Size(0, 0)
      }); // move the infowindow up slightly to the top of the marker icon
      infowindow.open(map);
      { passive: true }
      activeWindow = infowindow;
    });


    if (rate != "") {
      let dynamicFontSize = (24 - (rate.length * 1.2)).toString() + 'px'
      priceIcon.setLabel({ text: rate, fontSize: dynamicFontSize, color: "white", fontWeight: "bold" })
    }

    if (icon != "") {
      priceIcon.setIcon({ url: icon, anchor: { x: 15, y: 15 } })
    } else {
      priceIcon.setIcon({ url: "images/text-background.png", anchor: { x: 30, y: 15 } })
    }

    if (center != 'NEED') {
      priceIcon.setPosition(center)
    }
    // make parking assets 'clickable' and popup and populate infowindow
    polygonLayer.addListener('click', function (event) {
      if (activeWindow != null) {
        activeWindow.close()
      }
      let html = '<strong>' + name + '</strong>' + '<br><br>' + description;
      infowindow.setContent(html)

      infowindow.setPosition(event.latLng);
      infowindow.setOptions({
        pixelOffset: new google.maps.Size(0, 0)
      }); // move the infowindow up slightly to the top of the marker icon
      infowindow.open(map);
      { passive: true }
      activeWindow = infowindow;
    });

    // make charge stations 'clickable' and popup and populate infowindow
    markerLayer.addListener('click', function (event) {
      if (activeWindow != null) {
        activeWindow.close()
      }
      let html = '<strong>' + name + '</strong>' + '<br><br>' + description;
      infowindow.setContent(html)

      infowindow.setPosition(event.latLng);
      infowindow.setOptions({
        pixelOffset: new google.maps.Size(0, 0)
      }); // move the infowindow up slightly to the top of the marker icon
      infowindow.open(map);
      { passive: true }
      activeWindow = infowindow;
    });

    // make polylines 'clickable' and popup and populate infowindow
    polyLineLayer.addListener('click', function (event) {
      if (activeWindow != null) {
        activeWindow.close()
      }
      let html = '<strong>' + name + '</strong>' + '<br><br>' + description;
      infowindow.setContent(html)

      infowindow.setPosition(event.latLng);
      infowindow.setOptions({
        pixelOffset: new google.maps.Size(0, 0)
      }); // move the infowindow up slightly to the top of the marker icon
      infowindow.open(map);
      { passive: true }
      activeWindow = infowindow;
    });


    // ******controls and filters*****************************************************************************************************

    // set variables for layer controls

    let toggleShowAll = document.getElementById('toggleShowAll')


    let toggleHandicapLayer = document.getElementById('toggleHandicap')
    let toggleMunicipalGaragesLayer = document.getElementById('toggleMunicipalGarages')
    let togglePrivateGaragesLayer = document.getElementById('togglePrivateGarages')
    let toggleSmartMetersLayer = document.getElementById('toggleSmartMeters')
    let toggleBlueTopMetersLayer = document.getElementById('toggleBlueTopMeters')
    let toggleBrownTopMetersLayer = document.getElementById('toggleBrownTopMeters')
    let toggleYellowTopMetersLayer = document.getElementById('toggleYellowTopMeters')
    let toggleEVChargeLayer = document.getElementById('toggleEVCharge')
    let toggleMotorcycleLayer = document.getElementById('toggleMotorcycle')
    let toggleBusLargeVehicleLayer = document.getElementById('toggleBusLargeVehicle')
    let toggleResidentialLayer = document.getElementById('toggleResidential')
    let toggleLoadingUnloadingLayer = document.getElementById('toggleLoadingUnloading')

    // ***** Toggle display of map overlay components **********************************************************
    // toggle small icons on or off
    function showSmallIcons(theLayer) {
      if (theLayer.checked === false) {
        priceIcon.setMap()
      } else if (theLayer.checked === true) {
        priceIcon.setMap(map)
      }
    }

    // function to toggle specific types of parking asset on or off
    function toggleLayer(theLayer) {
      if (theLayer.checked === false) {
        polygonLayer.setVisible(false)
      } else if (theLayer.checked === true) {
        polygonLayer.setVisible(true)
      }
    }

    function togglePolyLineLayer(theLayer) {
      if (theLayer.checked === false) {
        polyLineLayer.setVisible(false)
      } else if (theLayer.checked === true) {
        polyLineLayer.setVisible(true)
      }
    }

    //Toggle specific types of parking asset plus small icons 
    function toggleHandicap() {
      if (name === 'Handicapped' || name === 'Handicapped Parking') {
        let theLayer = toggleHandicapLayer
        toggleLayer(theLayer)
        if (map.zoom > 18) {
          showSmallIcons(theLayer)
        }
        if (map.zoom <= 18) { priceIcon.setMap() }
      }
    }
    function toggleMunicipalGarages() {
      if (ownership === 'municipal') {
        let theLayer = toggleMunicipalGaragesLayer
        toggleLayer(theLayer)
        if (map.zoom > 17) {
          showSmallIcons(theLayer)
        }
        if (map.zoom <= 17) { priceIcon.setMap() }
      }
    }
    function togglePrivateGarages() {
      if (ownership === 'private') {
        let theLayer = togglePrivateGaragesLayer
        toggleLayer(theLayer)
        if (map.zoom > 17) {
          showSmallIcons(theLayer)
        }
        if (map.zoom <= 17) { priceIcon.setMap() }
      }
    }
    function toggleSmartMeters() {
      if (name === 'Smart Meters') {
        let theLayer = toggleSmartMetersLayer
        toggleLayer(theLayer)
        if (map.zoom > 18) {
          showSmallIcons(theLayer)
        }
        if (map.zoom <= 18) { priceIcon.setMap() }
      }
    }
    function toggleBlueTopMeters() {
      if (name === 'Blue Top Meters') {
        let theLayer = toggleBlueTopMetersLayer
        toggleLayer(theLayer)
        togglePolyLineLayer(theLayer)
        if (map.zoom > 18) {
          showSmallIcons(theLayer)
        }
        if (map.zoom <= 18) { priceIcon.setMap() }
      }
    }
    function toggleBrownTopMeters() {
      if (name === 'Brown Top Meters') {
        let theLayer = toggleBrownTopMetersLayer
        toggleLayer(theLayer)
        if (map.zoom > 18) {
          showSmallIcons(theLayer)
        }
        if (map.zoom <= 18) { priceIcon.setMap() }
      }
    }
    function toggleYellowTopMeters() {
      if (name === 'Yellow Top Meters') {
        let theLayer = toggleYellowTopMetersLayer
        toggleLayer(theLayer)
        if (map.zoom > 19) {
          showSmallIcons(theLayer)
        }
        if (map.zoom <= 19) { priceIcon.setMap() }
      }
    }
    function toggleEVCharge() {  // note complexity is due to charge stations having multiple names plus most are geometry: Point while 2 are linestrings
      if (geometry === 'Point' || name === 'Charging Station North EV' || name === 'Charging Station') {
        if (toggleEVChargeLayer.checked === false) {
          markerLayer.setMap()
        } else if (toggleEVChargeLayer.checked === true) {
          markerLayer.setMap(map)
        }
      }
      if (name === 'Charging Station North EV' || name === 'Charging Station') {
        let theLayer = toggleEVChargeLayer
        toggleLayer(theLayer)
        // small icons not shown on this type
      }
    }

    function toggleMotorcycle() {
      if (name === 'Motorcycle Parking') {
        let theLayer = toggleMotorcycleLayer
        toggleLayer(theLayer)
        if (map.zoom > 19) {
          showSmallIcons(theLayer)
        }
        if (map.zoom <= 19) { priceIcon.setMap() }
      }
    }
    function toggleBusLargeVehicle() {
      if (name === 'Bus Parking') {
        let theLayer = toggleBusLargeVehicleLayer
        toggleLayer(theLayer)
        if (map.zoom > 19) {
          showSmallIcons(theLayer)
        }
        if (map.zoom <= 19) { priceIcon.setMap() }
      }
    }
    function toggleResidential() {
      if (name === 'Residential Parking') {
        let theLayer = toggleResidentialLayer
        toggleLayer(theLayer)
        if (map.zoom > 17) {
          showSmallIcons(theLayer)
        }
        if (map.zoom <= 17) { priceIcon.setMap() }
      }
    }
    function toggleLoadingUnloading() {
      if (name === 'Loading/Unloading Only') {
        let theLayer = toggleLoadingUnloadingLayer
        toggleLayer(theLayer)
        if (map.zoom > 19) {
          showSmallIcons(theLayer)
        }
        if (map.zoom <= 19) { priceIcon.setMap() }
      }
    }

    // **************create toggle event on click of dom element
    toggleHandicapLayer.addEventListener('click', function () {
      toggleHandicap()
    });
    toggleMunicipalGaragesLayer.addEventListener('click', function () {
      toggleMunicipalGarages()
    });
    togglePrivateGaragesLayer.addEventListener('click', function () {
      togglePrivateGarages()
    });
    toggleSmartMetersLayer.addEventListener('click', function () {
      toggleSmartMeters()
    });
    toggleBlueTopMetersLayer.addEventListener('click', function () {
      toggleBlueTopMeters()
    });
    toggleBrownTopMetersLayer.addEventListener('click', function () {
      toggleBrownTopMeters()
    });
    toggleYellowTopMetersLayer.addEventListener('click', function () {
      toggleYellowTopMeters()
    });
    toggleEVChargeLayer.addEventListener('click', function () {
      toggleEVCharge()
    });
    toggleMotorcycleLayer.addEventListener('click', function () {
      toggleMotorcycle()
    });
    toggleBusLargeVehicleLayer.addEventListener('click', function () {
      toggleBusLargeVehicle()
    });
    toggleResidentialLayer.addEventListener('click', function () {
      toggleResidential()
    });
    toggleLoadingUnloadingLayer.addEventListener('click', function () {
      toggleLoadingUnloading()
    });

    // make small icons visible or not depending on zoom level
    map.addListener('zoom_changed', function () {
      toggleHandicap()
      toggleMunicipalGarages()
      togglePrivateGarages()
      toggleSmartMeters()
      toggleBlueTopMeters()
      toggleBrownTopMeters()
      toggleYellowTopMeters()
      toggleEVCharge()
      toggleMotorcycle()
      toggleBusLargeVehicle()
      toggleResidential()
      toggleLoadingUnloading()
    })
  })
  //  **************end of forEach Loop ***********************************************end of forEach Loop*****************

   //turn off residential and loading/unloading to start
  function startCondition() {
    if ((document.getElementById('toggleHandicap').checked) === true) {
      document.getElementById('toggleHandicap').click();
    }
    if ((document.getElementById('toggleMunicipalGarages').checked) === false) {
      document.getElementById('toggleMunicipalGarages').click();
      console.log('it is true')
    }
    if ((document.getElementById('togglePrivateGarages').checked) === false) {
      document.getElementById('togglePrivateGarages').click();
    }
    if ((document.getElementById('toggleSmartMeters').checked) === true) {
      document.getElementById('toggleSmartMeters').click();
    }
    if ((document.getElementById('toggleBlueTopMeters').checked) === true) {
      document.getElementById('toggleBlueTopMeters').click();
    }
    if ((document.getElementById('toggleBrownTopMeters').checked) === true) {
      document.getElementById('toggleBrownTopMeters').click();
    }
    if ((document.getElementById('toggleYellowTopMeters').checked) === true) {
      document.getElementById('toggleYellowTopMeters').click();
    }
    if ((document.getElementById('toggleEVCharge').checked) === true) {
      document.getElementById('toggleEVCharge').click();
    }
    if ((document.getElementById('toggleMotorcycle').checked) === true) {
      document.getElementById('toggleMotorcycle').click();
    }
    if ((document.getElementById('toggleBusLargeVehicle').checked) === true) {
      document.getElementById('toggleBusLargeVehicle').click();
    }
    if ((document.getElementById('toggleResidential').checked) === true) {
      document.getElementById('toggleResidential').click();
    }
    if ((document.getElementById('toggleLoadingUnloading').checked) === true) {
      document.getElementById('toggleLoadingUnloading').click();
    }
  }
  startCondition()

  // turn all parking assets on - visible regardless of prior visibility
  function showAll() {
    if ((document.getElementById('toggleHandicap').checked) === false) {
      document.getElementById('toggleHandicap').click();
    }
    if ((document.getElementById('toggleMunicipalGarages').checked) === false) {
      document.getElementById('toggleMunicipalGarages').click();
      console.log('it is true')
    }
    if ((document.getElementById('togglePrivateGarages').checked) === false) {
      document.getElementById('togglePrivateGarages').click();
    }
    if ((document.getElementById('toggleSmartMeters').checked) === false) {
      document.getElementById('toggleSmartMeters').click();
    }
    if ((document.getElementById('toggleBlueTopMeters').checked) === false) {
      document.getElementById('toggleBlueTopMeters').click();
    }
    if ((document.getElementById('toggleBrownTopMeters').checked) === false) {
      document.getElementById('toggleBrownTopMeters').click();
    }
    if ((document.getElementById('toggleYellowTopMeters').checked) === false) {
      document.getElementById('toggleYellowTopMeters').click();
    }
    if ((document.getElementById('toggleEVCharge').checked) === false) {
      document.getElementById('toggleEVCharge').click();
    }
    if ((document.getElementById('toggleMotorcycle').checked) === false) {
      document.getElementById('toggleMotorcycle').click();
    }
    if ((document.getElementById('toggleBusLargeVehicle').checked) === false) {
      document.getElementById('toggleBusLargeVehicle').click();
    }
    if ((document.getElementById('toggleResidential').checked) === false) {
      document.getElementById('toggleResidential').click();
    }
    if ((document.getElementById('toggleLoadingUnloading').checked) === false) {
      document.getElementById('toggleLoadingUnloading').click();
    }
  };

  // turn on only off street parking (reset map to startup condition)
  let onOff = 'off'
  toggleShowAll.addEventListener('click', function () {
    if (onOff === 'off') {
      showAll()
      onOff = 'On'
    } else {
      startCondition()
      onOff = 'off'
    }
  });



  // show all parking when zoomed in from search bar
  function toggleOnZoom() {
    if ((document.getElementById('toggleHandicap').checked) === true) {
      document.getElementById('toggleHandicap').click();
    }
    if ((document.getElementById('toggleMunicipalGarages').checked) === false) {
      document.getElementById('toggleMunicipalGarages').click();
    }
    if ((document.getElementById('togglePrivateGarages').checked) === false) {
      document.getElementById('togglePrivateGarages').click();
    }
    if ((document.getElementById('toggleSmartMeters').checked) === false) {
      document.getElementById('toggleSmartMeters').click();
    }
    if ((document.getElementById('toggleBlueTopMeters').checked) === false) {
      document.getElementById('toggleBlueTopMeters').click();
    }
    if ((document.getElementById('toggleBrownTopMeters').checked) === false) {
      document.getElementById('toggleBrownTopMeters').click();
    }
    if ((document.getElementById('toggleYellowTopMeters').checked) === true) {
      document.getElementById('toggleYellowTopMeters').click();
    }
    if ((document.getElementById('toggleEVCharge').checked) === true) {
      document.getElementById('toggleEVCharge').click();
    }
    if ((document.getElementById('toggleMotorcycle').checked) === true) {
      document.getElementById('toggleMotorcycle').click();
    }
    if ((document.getElementById('toggleBusLargeVehicle').checked) === false) {
      document.getElementById('toggleBusLargeVehicle').click();
    }
    if ((document.getElementById('toggleResidential').checked) === true) {
      document.getElementById('toggleResidential').click();
    }
    if ((document.getElementById('toggleLoadingUnloading').checked) === true) {
      document.getElementById('toggleLoadingUnloading').click();
    }

  };

  function toggleZoomFeaturesOn() {
    if (map.zoom >= 17.1) {
      toggleOnZoom()
    }
  }


  // *********** search box ************************************************************
  //Initialize autocomplete function in the searchbar
  let autocomplete = new google.maps.places.Autocomplete(input);
  // Limit autocomplete results to within a 2 mile (3218.688 meter) circle of downtown Burlington.
  autocomplete.setBounds(circle.getBounds());
  autocomplete.setOptions({ strictBounds: true });
  // Set the data fields to return when the user selects a place.
  autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);
  let addressinfowindow = new google.maps.InfoWindow();
  let infowindowContent = document.getElementById('infowindow-content');
  addressinfowindow.setContent(infowindowContent);
  let marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });
  // create walk circle
  let walkCircle = new google.maps.Circle({
    strokeColor: '#20346a',
    strokeOpacity: 0.8,
    strokeWeight: 3,
    fillOpacity: 0.0,
    center: map.center,
    radius: 95  //the average person can walk in a minute: 40-50 metres at a slow pace
  })

  autocomplete.addListener('place_changed', function () {

    // addressinfowindow.close();
    // marker.setVisible(false);
    let place = autocomplete.getPlace();
    // If the place has a geometry, then present it on a map plus add 3 minute walk circle.
    if (place.geometry.viewport) {
     
      map.fitBounds(place.geometry.viewport);
      map.setZoom(18.0);  //about 1 block
      toggleZoomFeaturesOn()
      addWalkCircle()
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);  // Why 17? Because it looks good.
    }
    //set marker on map from search bar
    map.setZoom(18.0);  //about 1 block
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);
    // add place name to infowindow
    infowindowContent.children['place-name'].textContent = place.name;
    // set infowindow on map and close after 6 seconds
    addressinfowindow.open(map, marker);
    setTimeout(function () { addressinfowindow.close(); }, 4500)

    // add walk circle function
    function addWalkCircle() {
      walkCircle.center = place.geometry.location
      walkCircle.setMap(map)
    }

    // reset search bar - pin - info window - walk circle
    function resetSearch() {
      addressinfowindow.close();
      marker.setVisible(false);
      walkCircle.setMap(null);
     
      map.setCenter({ lat: 44.478081, lng: -73.215 });
      map.setZoom(15)
      startCondition()
    }
    document.getElementById("pac-card").addEventListener('click', function () {
      document.getElementById('pac-input').value = "";
      resetSearch()
    })

  });

}
// resizeWindow()
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
  // setTimeout(closeModal, 1000)
}
// function closeModal() {
//   modal.style.display = "none"
// }

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
// Disclaimer modal

// Get the modal
var disclaimerModal = document.getElementById("disclaimerModal");


// Get the <span> element that closes the modal
var disclaimerSpan = document.getElementsByClassName("disclaimer-accept")[0];

// When the user clicks on <span> (x), close the modal
disclaimerSpan.onclick = function () {
  disclaimerModal.style.display = "none";
}

// Legend open/close
var legendToggle = document.getElementById("toggle-key");
let legend = document.getElementById("map-legend")
let legendClose = document.getElementById("legend-close")

legendToggle.addEventListener("click", function() {
   
    if (legend.style.display === "block") {
      legend.style.display = "none";
      legend.style.height = "0"
    } else {
      legend.style.display = "block";
      legend.style.height = "auto"
    }
  });

  legendClose.addEventListener("click", function() { 
      legend.style.display = "none";
  });