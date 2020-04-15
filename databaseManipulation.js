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
    console.log(data)
    for (let i = 0; i < 248; i++) {
      console.log(i)
      let desc = data.features[i].properties.description
      let firstChar = desc.charAt(0)

      if (firstChar === '<') {
        let sliceOne = desc.slice(desc.indexOf('<br><br>') + 8)
        let sliceTwo = sliceOne.slice(0, sliceOne.indexOf('<br><br>'))
      }

      else {
        let newObj = {}
        let splitDescArray = desc.split('<br>')
        splitDescArray.forEach(item => {
          let test2 = item.split(':')
          newObj[test2[0]] = test2[1]
          console.log(newObj)
        })
        // write obj to firebase here

      } // end of the else
    } // end of the for loop
  }) // end of the then

/*
let foo = data.split("\n").reduce(function(obj, str, index) {
  let strParts = str.split(":");
  if (strParts[0] && strParts[1]) { //<-- Make sure the key & value are not undefined
    obj[strParts[0].replace(/\s+/g, '')] = strParts[1].trim(); //<-- Get rid of extra spaces at beginning of value strings
  }
  return obj;
}, {});

console.log(foo); */
