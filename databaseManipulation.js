const firebaseConfig = {
  apiKey: "AIzaSyCJ_q627N1dryTYbcSjE4d-4jfsJJg5VcY",
  authDomain: "park-burlington.firebaseapp.com",
  databaseURL: "https://park-burlington.firebaseio.com",
  projectId: "park-burlington",
  storageBucket: "park-burlington.appspot.com",
  messagingSenderId: "474825299090",
  appId: "1:474825299090:web:d06b7eb22ba0309571c24b",
  measurementId: "G-HDKTL5YR29"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const database = firebase.database()
const ref = database.ref()

fetch("./BurlingtonParkingMap.geojson")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    for (let i in data) {
      for (i = 33; i < 249; i++){
      let coords = data.features[i].geometry.coordinates
      if (coords.length === 2) {
      let coordsSpliced = coords[0].splice(0, 2)
      let coordsRev = coordsSpliced.reverse()
      let coordsSpliced2 = coords[1].splice(0, 2)
      let coordsRev2 = coordsSpliced.reverse()
      let usersRef = ref.child(i);
      usersRef.update({center: midPoint(coordsRev, coordsRev2)})
      }
      }
    }
  })
  function midPoint( [latitude1, longitude1], [ latitude2, longitude2 ]) {
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
    let latOutput = lat / DEG_TO_RAD
    let lngOutput = lng / DEG_TO_RAD
    let midPointArray = lngOutput.toString() + ',' +  latOutput.toString() 
    return (midPointArray);

  };

for ( let i = 246; i<248; i++){

}
    

// all into same for loop to ensure we're iterating on the same counter 
// object.coordinates into function below
// split will return an array 
// try to pass array as argument to midPoint 
// if path.length is 2 , then we set the center based on that selection
// resulting strings ==> numbers 

// old code below


    // for (let i = 5; i < 248 ; i++) {
    //   let desc = data.features[i].properties.description
    //   let firstChar = desc.charAt(0)
    //   if (firstChar === '<') {
    //     let newObj ={}
    //     let sliceOne = desc.slice(desc.indexOf('<br><br>') + 8)
    //     let sliceTwo = sliceOne.slice(0, sliceOne.indexOf('<br><br>'))
    //     let sliceThree = sliceTwo.split('<br>')
    //     sliceThree.forEach(item => {
    //       let test2 = item.split(':')
    //       console.log(test2)
    //       newObj[test2[0]] = test2[1]
    //       let usersRef = ref.child(i);
    //       usersRef.set({newObj})
    //     })
    //   }
    //   else {
    //     let newObj = {}
    //     let splitDescArray = desc.split('<br>')
    //     splitDescArray.forEach(item => {
    //       let test2 = item.split(':').trim
    //       newObj[test2[0]] = test2[1]
    //       let usersRef = ref.child(i);
    //       usersRef.set({newObj})
    //     })


    //   } // end of the else
   // } // end of the for loop
 // end of the then

/*
let foo = data.split("\n").reduce(function(obj, str, index) {
  let strParts = str.split(":");
  if (strParts[0] && strParts[1]) { //<-- Make sure the key & value are not undefined
    obj[strParts[0].replace(/\s+/g, '')] = strParts[1].trim(); //<-- Get rid of extra spaces at beginning of value strings
  }
  return obj;
}, {});

console.log(foo); */
