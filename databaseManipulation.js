 const firebaseConfig = {
    apiKey: "AIzaSyCzF-ZRTKrJBVYSNkF6k1qtBqrUNj_XURs",
    authDomain: "parkbtv-test.firebaseapp.com",
    databaseURL: "https://parkbtv-test.firebaseio.com",
    projectId: "parkbtv-test",
    storageBucket: "parkbtv-test.appspot.com",
    messagingSenderId: "536845978618",
    appId: "1:536845978618:web:c4c0e5a5d80adca02b3243",
    measurementId: "G-0FYCDJEBHT"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  const database = firebase.database()
  const ref = database.ref()
  let data;

  fetch("./BurlingtonParkingMap.geojson")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
  let desc = data.features[157].properties.description
  let firstChar = desc.charAt(0)
  if (firstChar === '<') {
  let sliceOne = desc.slice(desc.indexOf('<br><br>')+8)
  let sliceTwo = sliceOne.slice(0, sliceOne.indexOf('<br><br>'))
  let splitDescArray = sliceTwo.split('<br>')
  console.log(splitDescArray)
  } else {
    splitDescArray = desc.split('<br>').reduce
    (function(obj, str, index) {
      let strParts = str.split(':');
      if (strParts[0] && strParts[1]) { //<-- Make sure the key & value are not undefined
        obj[strParts[0].replace(/\s+/g, '')] = strParts[1].trim(); //<-- Get rid of extra spaces at beginning of value strings
      console.log(typeof(strParts))
      console.log(strParts)
      }
    })
    return obj
  }
}, {} );

/*
let foo = data.split("\n").reduce(function(obj, str, index) {
  let strParts = str.split(":");
  if (strParts[0] && strParts[1]) { //<-- Make sure the key & value are not undefined
    obj[strParts[0].replace(/\s+/g, '')] = strParts[1].trim(); //<-- Get rid of extra spaces at beginning of value strings
  }
  return obj;
}, {});

console.log(foo); */
